import React, { useRef, useState } from "react";

const Video = ({ src, ...props }) => {
	const videoRef = useRef();
	const [isLoading, setIsLoading] = useState(true);
	const [isVideoPlay, setIsVideoPlay] = useState(true);
	const [videoDetails, setVideoDetails] = useState({
		isMuted: true,
		videoLength: 0, 
		currentTime: 0,
		totalWatchTime: 0,
		totalPlayPauseButtonClick: 0,
		historyOfPlayPauseButtonPress : []
	});
	const _handleClick = (e) => {
		e.preventDefault();
		console.log(e)
		// videoRef.current?.muted = videoDetails?.isMuted;
		e.target.defaultMuted = videoDetails?.isMuted;
		e.target.muted = videoDetails?.isMuted;

		setVideoDetails({ ...videoDetails, isMuted: !videoDetails?.isMuted });
	}
	const _handlePlayVideo = () => {
		// videoRef.current?.autoPlay = true;
		// videoRef.current?.muted = true;
		setIsLoading(false);
		setVideoDetails({ ...videoDetails, videoLength: videoRef.current?.duration });
	}
	const _playPauseVideo = () => {
		if (isVideoPlay) {
			videoRef.current.pause();
			setIsVideoPlay(false);
		} else {
			videoRef.current.play();
			setIsVideoPlay(true);
		}
		setVideoDetails({ ...videoDetails, totalPlayPauseButtonClick: videoDetails.totalPlayPauseButtonClick + 1});
	}
	// console.log(videoRef, videoDetails);

	return (
		<div className="relative">
			<video autoplay="true" muted={videoDetails?.isMuted} ref={videoRef} {...props} className="w-full max-w-[1200px] mx-auto my-8" onPlay={_handlePlayVideo}>
				<source src={src} type='video/mp4'></source>
			</video>
			{/* video overlay */}
			<div className="absolute left-0 right-0 top-0 w-full h-full px-[2px] flex flex-col justify-end">
				{
					// loading state
					isLoading ? (<div className="absolute top-[50%] left-[50%] text-white">Loading...</div>) :
						// video player functionalities
						<>
							{/* progress bar */}
							<div className="h-[8px] w-full bg-gray-500 rounded-2xl mb-10 cursor-pointer">
								{/* progress bar inner */}
								<div className="relative h-full bg-red-600 w-[0%] progress-bar-inner" style={{
									animationPlayState: isVideoPlay ? "running" : "paused",
									animationDuration: isLoading ? `0s` : `${videoRef.current?.duration}s`
								}}>
									<div className="absolute -right-5 -top-[70%] rounded-full h-[20px] w-[20px] bg-white flex justify-end"></div>
								</div>
							</div>
							{/* water mark */}
							<div className="absolute right-2 bottom-[70px]  text-white bg-red-600 w-24 rounded-xl p-2">watermark</div>

							{/* video control */}
							<div className="absolute bottom-2 text-white flex gap-3">
								<button onClick={_playPauseVideo} className="w-10">{isVideoPlay ? "Pause" : "Play"}</button>
								<button onClick={_handleClick} className="w-12">{videoDetails?.isMuted ? "Unmute" : "Mute"}</button>
								<div>
									{videoDetails?.currentTime} / {videoDetails?.videoLength}
								</div>
							</div>
						</>}
			</div>
		</div>
	)
}

export { Video };

