import { useContext, useEffect, useRef, useState } from 'react';
import { FileContext } from '../contexts/fileContext';

import AudioApp from './audioApp';
import AudioList from './audioList';

const UploadFile = () => {
    const inputFile = useRef(null);
    const { fileURL, setFileURL } = useContext(FileContext);
    const [file, setFile] = useState(null);

    useEffect(() => {
        if (file) {
            setFileURL(file);
        }
    }, [file, setFileURL]);

    const handleButtonClick = () => {
        inputFile.current.click();
    };

    const handleFileUpload = (e) => {
        setFile(URL.createObjectURL(e.target.files[0]));
    };

    const AudioFunc = (audioPath) => {
        setFile("/statics/audio/"+audioPath);
    };

    return (
        <div className="App">
            <button className='upload-btn' onClick={handleButtonClick}>
                오디오 업로드
            </button>
            <input
                type='file'
                id='file'
                ref={inputFile}
                style={{ display: 'none' }}
                accept='audio/*'
                onChange={handleFileUpload}
            />
            {
                file ?
                    (
                        <>
                            <AudioList AudioFunc={AudioFunc}/>
                            <AudioApp fileURLs={file} />
                        </>
                    ) :
                    (
                        <div>확인할 음성 파일 업로드</div>
                    )
            }
        </div>
    );
}

export default UploadFile;
