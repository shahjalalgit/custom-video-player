import React, { useRef, useState } from "react";
import { BsFillPlayFill, BsFullscreenExit, BsPauseCircle, BsPlayCircle, BsVolumeMute, BsVolumeUp } from "react-icons/bs";
import { TbPictureInPicture } from "react-icons/tb";
const Video = ({ src, ...props }) => {
	const videoRef = useRef();
	const containerRef = useRef();
	const [isLoading, setIsLoading] = useState(true);
	const [isVideoPlay, setIsVideoPlay] = useState(true);
	const [isVideoEnd, setIsVideoEnd] = useState(false);
	const [isFullScreen, setIsFullScreen] = useState(false);
	const [totalTime, setTotalTime] = useState(0);
	const [volume, setVolume] = useState(0);
	const [videoDetails, setVideoDetails] = useState({
		isMuted: true,
		videoLength: 0,
		currentTime: 0,
		totalWatchTime: 0,
		totalPlayPauseButtonClick: 0,
		historyOfPlayPauseButtonPress: []
	});
	const _handlePlayVideo = () => {
		setIsVideoEnd(false);
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
		setVideoDetails({ ...videoDetails, totalPlayPauseButtonClick: 1 + videoDetails.totalPlayPauseButtonClick, historyOfPlayPauseButtonPress: [...videoDetails.historyOfPlayPauseButtonPress, { count: 1 + videoDetails.totalPlayPauseButtonClick, time: videoDetails?.currentTime, press: isVideoPlay ? "pasue" : " play" }] });
	}
	const _onTimeUpdate = () => {
		setIsLoading(false)
		// console.log(videoRef.current?.currentTime)
		setVideoDetails({ ...videoDetails, currentTime: videoRef.current?.currentTime });
		setTotalTime(videoRef.current?.currentTime)
	}
	const _handleEnded = () => {
		setIsVideoEnd(true);
		setIsLoading(false);
		setIsVideoPlay(false);
		setVideoDetails({ ...videoDetails, currentTime: 0, totalWatchTime: videoDetails?.totalWatchTime + totalTime });
	}

	const _handleMuteUnmute = (e) => {
		setVideoDetails({ ...videoDetails, isMuted: !videoDetails?.isMuted });
		videoRef.current.defaultMuted = !videoDetails?.isMuted;
		videoRef.current.muted = !videoDetails?.isMuted;
		if (!videoDetails?.isMuted){
			setVolume(0)
		} else {
			setVolume(videoRef.current.volume)
		}
	}
	const _handleVolumeControl = (e) => {
		videoRef.current.volume = e.target.value
		setVolume(e.target.value)
		if (e.target.value == 0){
		  setVideoDetails({ ...videoDetails, isMuted: true });
		}else{
		  setVideoDetails({ ...videoDetails, isMuted: false });
		} 
	}
	const _handlePicInPic = () => {
		setFullScreen(old => !old)
		videoRef.current.requestPictureInPicture();
	}
	const _handleFullScreen = () => {
		console.log(containerRef.current);
		if (containerRef.current.fullscreenElement){
			return document.exitFullscreen
		} else {
			containerRef.current.requestFullscreen()
		}
	}
	const _handleVideoTimeline = (e) => {
		// console.log(e.nativeEvent.offsetX)
		let videoTimelineWidth = videoRef.current.clientWidth; // getting video timeline width
		let currentTime = ((e.nativeEvent.offsetX) / videoTimelineWidth) * videoRef.current.duration;
		videoRef.current.currentTime = currentTime;
		let time = Math.ceil((videoRef.current.currentTime / videoRef.current.duration) * 100);
		console.log(time, currentTime)
	}
	const fastForward = () => {
		videoRef.current.currentTime += 5;
	};

	const revert = () => {
		videoRef.current.currentTime -= 5;
	};
	// console.log(videoRef.current?.muted)

	return (
		<>
			<div className="relative group w-[100%]" ref={containerRef}>
				<video autoPlay={true} muted={videoDetails?.isMuted} ref={videoRef} {...props} className="w-full max-w-[1200px] mx-auto my-8" onPlay={_handlePlayVideo} onWaiting={() => setIsLoading(true)} onPlaying={() => setIsLoading(false)} onTimeUpdate={_onTimeUpdate} onEnded={_handleEnded}>
					<source src={src} type='video/mp4'></source>
				</video>
				{/* video overlay */}
				<div className="absolute left-0 right-0 top-0 w-full h-full px-[10px] flex flex-col justify-end">
					{
						// loading state
						isLoading ? (<div className="absolute top-[50%] left-[50%] text-white">Loading...</div>) :
							// video player functionalities
							<>
								{/* progress bar */}
								<div className="relative h-[8px] w-full bg-gray-500 rounded-2xl mb-10 cursor-pointer" onClick={_handleVideoTimeline}>
									{/* progress bar inner */}
									<div className={`relative h-full bg-red-600`} style={{
										width: `${Math.ceil((videoRef.current.currentTime / videoRef.current.duration) * 100)}%`, 
									transition: "all 0.3s"
									 }} >
										<div className="absolute -right-2 -top-[70%] rounded-full h-[20px] w-[20px] bg-white flex justify-end"></div>
									</div>
								</div>
								{/* water mark */}
								<div className="absolute right-2 bottom-[70px]  text-white bg-red-600 w-24 rounded-xl p-2">watermark</div>

								{/* video control */}
								<div className="absolute bottom-2 text-white flex items-center justify-between w-full pr-8">
									<div className="flex items-center gap-3">
										{/* play/pause control */}
										<button onClick={_playPauseVideo}>{isVideoPlay ? <BsPauseCircle className="h-6 w-6" /> : <BsFillPlayFill className="h-6 w-6" />}</button>

										{/* mute/unmute control */}
										<button onClick={_handleMuteUnmute}>{videoRef.current?.muted ? <BsVolumeMute className="h-6 w-6" /> : <BsVolumeUp className="h-6 w-6" />}</button>
										{/* volume range  */}
										<input value={volume} onChange={_handleVolumeControl} className="w-[20%] h-1 rounded-full" type="range" step="any" min="0" max="1" />
										{/* video timing */}
										<div>
											{formateTime(videoDetails?.currentTime) ?? "00:00"} / {formateTime(videoDetails?.videoLength) ?? "00:00"}
										</div>
									</div>
									<div className="flex items-center gap-3">
										<button onClick={_handlePicInPic}><TbPictureInPicture className="h-6 w-6" /></button>
										<button onClick={_handleFullScreen}><BsFullscreenExit className="h-6 w-6" /></button>
									
									</div>
								</div>
								{/* middle play/pause button */}
								<button onClick={_playPauseVideo} className="absolute top-[40%] right-[45%] text-white invisible group-hover:visible">{isVideoPlay ? <BsPauseCircle className="h-20 w-20" /> : <BsPlayCircle className="h-20 w-20" />}</button>
							</>}
				</div>
			</div>
			{/* video details */}
			<div>
				<h1 className="font-bold underline">Data</h1>
				<div>
					video length: {formateTime(videoDetails?.videoLength) ?? "00:00"}
					<br />
					Total watch time: {formateTime(videoDetails?.totalWatchTime + videoDetails?.currentTime) ?? "00:00"}
					<br />
					Total play pause button click: {videoDetails?.totalPlayPauseButtonClick}
					<br />
					History of play/pause button press: [ {
						videoDetails?.historyOfPlayPauseButtonPress?.map((data, index) => {
							return (
								<div key={index}>
									{`{
										count: ${data?.count} ,
										time: ${formateTime(data?.time) ?? "00:00"} ,
										button_press: ${data?.press}
									}`}
								</div>
							)
						})
					} ]
				</div>
			</div>
		</>
	)
}


const formateTime = (time) => {
	if (!time) {
		return 0
	}
	const tenPad = (time) => {
		if (time < 10) {
			return `0${time}`
		} else {
			return time
		}
	}
	const one_sec = 60;
	const seconds = Math.floor(time % 60);
	const minutes = Math.floor(time / 60) % 60;
	const hours = Math.floor(time / 3600);
	if(hours == 0){
		return `${tenPad(minutes)}:${tenPad(seconds)}`;
	}
	return `${tenPad(hours)}:${tenPad(minutes)}:${tenPad(seconds)}`;
}

export { Video };
