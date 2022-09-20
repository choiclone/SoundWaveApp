import WaveSurfer from "wavesurfer.js";
import React, { useContext, useEffect, useRef, useState } from 'react';
import TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js';

import { FileContext } from '../contexts/fileContext';

const getTimeStringSeconds = (seconds) => {
	let min, sec;

	min = parseInt((seconds%3600)/60);
	sec = seconds%60;

	if (min.toString().length==1) min = "0" + min;
	if (sec.toString().length==1) sec = "0" + sec;

	return min + ":" + sec;
}

const AudioApp = ({ fileURLs }) => {
    const [playing, setPlaying] = useState(true);
    const [volume, setVolume] = useState(1);
    const [mutes, setMutes] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [durations, setDurations] = useState(getTimeStringSeconds(1));
    const [currentTimes, setCurrentTimes] = useState(getTimeStringSeconds(0));

    const { fileURL, setFileURL } = useContext(FileContext);

    const waveformRef = useRef(null);
    const timeformRef = useRef(null);
    const IntervalRef = useRef(null);

    useEffect(() => {
        return () => clearInterval(IntervalRef.current);
    }, []);

    useEffect(() => {
        if (!waveformRef.current) {
            clearInterval(IntervalRef.current);
            setFileURL(fileURLs);

            timeformRef.current = TimelinePlugin.create({
                container: "#timelineform",
                primaryColor: "#D3D3D3"
            });

            waveformRef.current = WaveSurfer.create({
                container: "#waveform",
                backend: 'MediaElement',
                mediaType: 'audio',
                backgroundColor: '#D3D3D3',
                waveColor: "#567FFF",
                progressColor: 'green',
                autoCenter: true,
                barGap: 2,
                barWidth: 1,
                barRadius: 1,
                cursorWidth: 3,
                cursorColor: "red",
                skipLength: 5,
                plugins: [
                    timeformRef.current,
                ],
                scrollParent: true,
            });
            waveformRef.current.on('ready', () => {
                IntervalRef.current = setInterval(async () => {
                    setCurrentTimes(getTimeStringSeconds(Math.floor(waveformRef.current.getCurrentTime())))
                }, 10);
                setDurations(getTimeStringSeconds(Math.floor(waveformRef.current.getDuration())));
            });
        }
    }, [waveformRef.current, timeformRef.current]);

    useEffect(() => {
        if (waveformRef.current.isPlaying()) {
            setPlaying(true);
            clearInterval(IntervalRef.current);
            waveformRef.current.pause();
        } 
        waveformRef.current.load(fileURLs);
        setCurrentTimes(getTimeStringSeconds(Math.floor(waveformRef.current.getCurrentTime())));
    }, [fileURLs, waveformRef.current]);

    useEffect(() => {
        if (waveformRef.current) {
            waveformRef.current.setVolume(volume);
            waveformRef.current.setMute(false);
        };
    }, [volume, waveformRef.current]);

    useEffect(() => {
        if (waveformRef.current) waveformRef.current.zoom(zoom);
    }, [zoom, waveformRef.current]);

    useEffect(() => {
        if(currentTimes === durations){
            clearInterval(IntervalRef.current);
            setPlaying(true);
        }
    }, [currentTimes])

    const playAudio = () => {
        if (waveformRef.current.isPlaying()) {
            setPlaying(true);
            clearInterval(IntervalRef.current);
            waveformRef.current.pause();
        } else {
            setPlaying(false);
            IntervalRef.current = setInterval(async () => {
                setCurrentTimes(getTimeStringSeconds(Math.floor(waveformRef.current.getCurrentTime())))
            }, 10);
            waveformRef.current.play();
        }
    };

    const handleReload = () => {
        clearInterval(IntervalRef.current);
        waveformRef.current.stop();
        waveformRef.current.play();
        setPlaying(false);
    };

    const handleVolumeSlider = (e) => {
        setVolume(e.target.value);
        if (e.target.value > 0) {
            setMutes(false);
        } else {
            setMutes(true);
        }
    };

    const handleZoomSlider = (e) => {
        setZoom(e.target.value);
    };

    const SkipForward = () => {
        waveformRef.current.skipForward();
    };

    const SkipBackend = () => {
        waveformRef.current.skipBackward();
    };

    const VolumeMute = () => {
        if (mutes) {
            waveformRef.current.setMute(false);
            setVolume(1)
            setMutes(false);
        } else {
            waveformRef.current.setMute(true);
            setVolume(0)
            setMutes(true);
        }
    }

    return (
        <div className="App">
            <div id="waveform" />
            <div id="timelineform" />
            <div style={{ fontSize: "35px" }}>
                {playing ?
                    (<HiOutlinePlay
                        style={{
                            cursor: "pointer"
                        }}
                        onClick={playAudio}
                    />)
                    :
                    (<HiOutlinePause
                        style={{
                            cursor: "pointer"
                        }}
                        onClick={playAudio}
                    />)
                }
                <AiOutlineReload
                    style={{
                        cursor: "pointer"
                    }}
                    onClick={handleReload}
                />
                {
                    mutes ? (
                        <HiOutlineVolumeOff
                            style={{
                                cursor: "pointer"
                            }}
                            onClick={VolumeMute}
                        />
                    ) : (
                        <HiOutlineVolumeUp
                            style={{
                                cursor: "pointer"
                            }}
                            onClick={VolumeMute}
                        />
                    )
                }

                <AiFillBackward
                    style={{
                        cursor: "pointer"
                    }}
                    onClick={SkipBackend}
                />

                <AiFillForward
                    style={{
                        cursor: "pointer"
                    }}
                    onClick={SkipForward}
                />
                <p
                    style={{
                        fontSize: "20px"
                    }}
                >
                    {currentTimes}/{durations}
                </p>
            </div>
            <div>
                <div>
                    <p>ZoomWave</p>
                    <HiOutlineZoomOut />
                    <input
                        type='range'
                        min='1'
                        max='100'
                        value={zoom}
                        onChange={handleZoomSlider}
                    />
                    <HiOutlineZoomIn />
                </div>

                <div>
                    <p>Volume</p>
                    <HiOutlineVolumeOff />
                    <input
                        type='range'
                        min='0'
                        max='1'
                        step='0.05'
                        value={volume}
                        onChange={handleVolumeSlider}
                    />
                    <HiOutlineVolumeUp />
                </div>
            </div>
        </div>
    );
}

export default AudioApp