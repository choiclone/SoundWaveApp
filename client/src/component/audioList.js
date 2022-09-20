import React, { useState, useEffect } from 'react'
import axios from 'axios';

const AudioList = ({
    AudioFunc,
}) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get('/api/audioLits')
            .then((res) => {
                setData(res.data.AudioList);
            }).catch((err) => {
                return () => console.log("error: ", err);
            });
    }, []);

    return (
        <div>
            {/* 
                DataBase에 동영상 목록을 가져와 선택하면서 
                해당 음성파일에 파장을 확인하도록 제작할 예정
            */}
            {
                data.map((item, key) => (
                    <div key={key}>
                        <p onClick={() => AudioFunc(item.name)}>
                            {item.name}
                        </p>
                    </div>
                ))
            }
        </div>
    )
}

export default AudioList