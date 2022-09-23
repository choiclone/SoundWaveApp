import React, { useContext, useEffect, useRef, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

import { FileContext } from '../contexts/fileContext';
import { TimeString, test } from '../script/FuncExport';

import WaveSurfer from "wavesurfer.js";
import TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js';
import AudioPlayer from "./audioPlayer";

const AudioApp = ({ fileURLs }) => {
    const [playing, setPlaying] = useState(true);
    const [volume, setVolume] = useState(1);
    const [mutes, setMutes] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [durations, setDurations] = useState(TimeString(1));
    const [currentTimes, setCurrentTimes] = useState(TimeString(0));

    const { fileURL, setFileURL } = useContext(FileContext);

    const waveformRef = useRef(null);
    const timeformRef = useRef(null);
    const IntervalRef = useRef(null);
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

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
                waveColor: "white",
                progressColor: 'green',
                autoCenter: true,
                barGap: 2,
                barWidth: 0.5,
                barRadius: 1,
                cursorWidth: 3,
                height: 200,
                cursorColor: "red",
                skipLength: 5,
                plugins: [
                    timeformRef.current,
                ],
                scrollParent: true,
            });
            waveformRef.current.on('ready', () => {
                IntervalRef.current = setInterval(async () => {
                    setCurrentTimes(TimeString(Math.floor(waveformRef.current.getCurrentTime())))
                }, 10);
                setDurations(TimeString(Math.floor(waveformRef.current.getDuration())));
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
        setCurrentTimes(TimeString(Math.floor(waveformRef.current.getCurrentTime())));
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
        if (currentTimes === durations) {
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
                setCurrentTimes(TimeString(Math.floor(waveformRef.current.getCurrentTime())))
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

    const testSpeech = () => {
        if (!browserSupportsSpeechRecognition) {
            return <span>Browser doesn't support speech recognition.</span>;
        }
    }

    return (
        <div className="App">
            <AudioPlayer
                playAudio={playAudio}
                handleReload={handleReload}
                handleVolumeSlider={handleVolumeSlider}
                handleZoomSlider={handleZoomSlider}
                SkipForward={SkipForward}
                SkipBackend={SkipBackend}
                VolumeMute={VolumeMute}
                playing={playing}
                currentTimes={currentTimes}
                durations={durations}
                zoom={zoom}
                mutes={mutes}
                volume={volume}
            />
            <button onClick={testSpeech}>
                test
            </button>
        </div>
    );
}

export default AudioApp