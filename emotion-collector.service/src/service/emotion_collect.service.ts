import { EmotionCollectReq } from '@/dto/emotion_collect/request/emotion_collect.req';
import { EventEmotionCollectEnum } from '@/enums/event-emotion-collect.enum';
import { EmotionCollect } from '@/models/emotion_collect.model';
import { IEmotionCollectRepository } from '@/repository/interface/i.emotion_collect.repository';
import { BaseCrudService } from '@/service/base/base.service';
import { IEmotionCollectService } from '@/service/interface/i.emotion_collect.service';
import { inject, injectable } from 'inversify';

@injectable()
export class EmotionCollectService
  extends BaseCrudService<EmotionCollect>
  implements IEmotionCollectService<EmotionCollect>
{
  private emotionCollectRepository: IEmotionCollectRepository<EmotionCollect>;

  constructor(@inject('EmotionCollectRepository') emotionCollectRepository: IEmotionCollectRepository<EmotionCollect>) {
    super(emotionCollectRepository);
    this.emotionCollectRepository = emotionCollectRepository;
  }

  private PLAY_FULL_SCORE = 2.0; // Điểm số tối đa khi nghe 100% bài hát
  private LIKE_SCORE = 5.0; // Điểm số khi like bài hát
  private START_PLAYING_SCORE = 0.5; // Điểm số khi bắt đầu nghe bài hát

  /**
   *  Công thức: $$\text{score} = \text{MAX_SCORE} \cdot \tanh\left(\frac{p - \text{NEUTRAL_POINT}}{\text{SENSITIVITY}}\right)$$
   * Bước 1: (p - NEUTRAL_POINT) - Dịch chuyển điểm trung tâm
    Mục đích: Hàm tanh(x) gốc có điểm trung tâm (nơi giá trị bằng 0) tại x=0. Nhưng chúng ta không muốn điểm số bằng 0 khi người dùng nghe 0% bài hát. Chúng ta muốn điểm số bằng 0 tại một điểm hợp lý hơn, ví dụ như 55% hoặc 60%. Phép trừ này chính là để "dịch chuyển" điểm 0 đó.
    Ví dụ: Nếu ta chọn NEUTRAL_POINT = 55:
    Khi người dùng nghe p = 55%, biểu thức này sẽ là 55 - 55 = 0.
    Khi người dùng nghe p < 55%, biểu thức này sẽ là số âm.
    Khi người dùng nghe p > 55%, biểu thức này sẽ là số dương.
    Điều này đảm bảo điểm số sẽ âm khi nghe ít hơn 55% và dương khi nghe nhiều hơn 55%.

    Bước 2: / SENSITIVITY - Điều chỉnh độ nhạy (độ dốc)
    Mục đích: Tham số này quyết định xem đường cong của bạn "dốc" hay "thoải". Nó kiểm soát mức độ nhanh chóng mà điểm số chuyển từ âm sang dương. Đây là núm vặn quan trọng nhất để bạn tinh chỉnh hệ thống.
    Ví dụ:
    SENSITIVITY nhỏ (ví dụ: 15): Đường cong sẽ rất dốc. Điều này có nghĩa là chỉ cần nghe lệch khỏi NEUTRAL_POINT một chút, điểm số sẽ ngay lập tức tăng vọt lên gần MAX_SCORE hoặc tụt xuống gần -MAX_SCORE. Hệ thống trở nên rất "khó tính" và phân định rạch ròi thích/ghét.
    SENSITIVITY lớn (ví dụ: 40): Đường cong sẽ rất thoải. Điểm số sẽ thay đổi từ từ. Vùng "trung tính" sẽ rất rộng. Hệ thống trở nên "dễ tính" hơn và cho phép người dùng nghe một khoảng dài trước khi đưa ra kết luận.
    
    Bước 3: tanh(...) - Áp dụng đường cong
    Sau khi có được giá trị x = (p - NEUTRAL_POINT) / SENSITIVITY, chúng ta đưa nó vào hàm tanh.
    Kết quả của tanh(x) sẽ là một con số mượt mà trong khoảng [-1, 1], mang hình dạng chữ S mà chúng ta mong muốn.
    
    Bước 4: * MAX_SCORE - Mở rộng thang điểm
    Mục đích: Khoảng [-1, 1] có thể quá nhỏ để thể hiện sự khác biệt. Chúng ta cần nhân nó với một hệ số để có được thang điểm phù hợp với hệ thống của bạn.
    Ví dụ: Nếu bạn muốn điểm số dao động trong khoảng [-2, +2], bạn đặt MAX_SCORE = 2. Nếu bạn muốn là [-5, +5], bạn đặt MAX_SCORE = 5. Giá trị này nên được chọn dựa trên các loại điểm khác trong hệ thống của bạn (như điểm thưởng khi like).
   *  
   * @param playPercentage
   * @returns
   */
  private calculatePlayScore(playPercentage: number) {
    const p = playPercentage;

    const MAX_SCORE = 2.0; // Điểm số sẽ từ -2 đến +2
    const NEUTRAL_POINT = 55; // Nghe 55% thì được 0 điểm
    const SENSITIVITY = 25; // Điều chỉnh độ dốc của đường cong

    const x = (p - NEUTRAL_POINT) / SENSITIVITY;
    const score = MAX_SCORE * Math.tanh(x);

    return score;
  }

  async collect(emotionCollect: EmotionCollectReq): Promise<void> {
    let score = 0;
    switch (emotionCollect.event) {
      case EventEmotionCollectEnum.like:
        score = this.LIKE_SCORE;
        break;
      case EventEmotionCollectEnum.start_playing:
        score = this.START_PLAYING_SCORE;
        break;
      case EventEmotionCollectEnum.skip:
        score = this.calculatePlayScore(emotionCollect.play_percentage || 0);

        console.log(`Skip event: play_percentage=${emotionCollect.play_percentage}, calculated score=${score}`);

        break;
      case EventEmotionCollectEnum.listen_through:
        score = this.PLAY_FULL_SCORE;
        break;

      default:
        break;
    }

    const emotionCollectData = {
      userId: emotionCollect.userId,
      musicId: emotionCollect.musicId,
      emotion: emotionCollect.emotion,
      score: score
    };

    // Check if the emotion collect already exists
    const existingCollect = await this.emotionCollectRepository.findOne({
      filter: {
        userId: emotionCollectData.userId,
        emotion: emotionCollectData.emotion,
        musicId: emotionCollectData.musicId
      }
    });

    if (existingCollect) {
      // If it exists, update the score
      await this.emotionCollectRepository.findOneAndUpdate({
        filter: {
          userId: emotionCollectData.userId,
          emotion: emotionCollectData.emotion,
          musicId: emotionCollectData.musicId
        },
        updateData: { score: existingCollect.score + score }
      });
      return;
    }

    await this.emotionCollectRepository.create({
      data: emotionCollectData
    });
  }
}
