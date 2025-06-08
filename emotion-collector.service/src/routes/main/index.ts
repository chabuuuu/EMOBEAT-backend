import { ErrorCode } from '@/enums/error-code.enums';
import emotionCollectRouter from '@/routes/emotion_collect.route';
import BaseError from '@/utils/error/base.error';

export function route(app: any, root_api: string) {
  app.use(`${root_api}/emotion-collect`, emotionCollectRouter);
  app.all('*', (req: any, res: any, next: any) => {
    const err = new BaseError(ErrorCode.API_NOT_EXISTS, 'API Not Exists');
    next(err);
  });
}
