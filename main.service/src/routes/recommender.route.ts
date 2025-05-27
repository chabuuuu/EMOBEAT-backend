import { recommenderController } from '@/container/recommender.container';
import { authenticateAnonymous } from '@/middleware/authenticate-anonymous.middleware';
import express from 'express';
const recommenderRouter = express.Router();

recommenderRouter

  .get('/random-artist', authenticateAnonymous, recommenderController.getRandomArtist.bind(recommenderController))
  .get('/popular-albums', authenticateAnonymous, recommenderController.getPopularAlbums.bind(recommenderController))
  .get('/songs', authenticateAnonymous, recommenderController.getRecommendedSongs.bind(recommenderController))
  .get('/top-artist-today', authenticateAnonymous, recommenderController.getTopArtistToday.bind(recommenderController))
  .get(
    '/instrument-spotlight',
    authenticateAnonymous,
    recommenderController.getInstrumentSpotlight.bind(recommenderController)
  )
  .get('/eras-and-styles', authenticateAnonymous, recommenderController.getErasAndStyles.bind(recommenderController));

export default recommenderRouter;
