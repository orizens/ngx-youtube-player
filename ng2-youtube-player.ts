import { YoutubePlayer } from './src/youtube-player.component';
import { YoutubePlayerService } from './src/youtube-player.service';

export * from './src/youtube-player.component';
export * from './src/youtube-player.service';
export * from './src/index';

export default {
	directives: [ YoutubePlayer, YoutubePlayerService ]
}
