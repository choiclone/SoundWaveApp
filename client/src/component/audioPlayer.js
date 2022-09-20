import React from 'react'
import { AiOutlineReload, AiFillBackward, AiFillForward } from 'react-icons/ai';
import {
    HiOutlineVolumeUp,
    HiOutlineVolumeOff,
    HiOutlineZoomIn,
    HiOutlineZoomOut,
    HiOutlinePlay,
    HiOutlinePause
} from 'react-icons/hi';

const AudioPlayer = ({
    playAudio,
    handleReload,
    handleVolumeSlider,
    handleZoomSlider,
    SkipForward,
    SkipBackend,
    VolumeMute,
    playing,
    currentTimes,
    durations,
    zoom,
    mutes,
    volume,
}) => {

    return (
        <>
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
        </>
    )
}

export default AudioPlayer