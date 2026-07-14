import {useState} from 'react'
import {Image, Skeleton} from '@mantine/core'

interface BookCoverProps {
    isbn: string;
    w: number;
    h: number;
}

function BookCover(props: BookCoverProps)
{
    const {isbn, w, h} = props;

    const [isLoaded, setIsLoaded] = useState(false)
    const [isMissing, setIsMissing] = useState(false)

    const height = h ?? Math.round(w * 1.4)
    const src = `http://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`

    const handleLoad = (e: { currentTarget: { naturalWidth: number; }; }) => {
        if (e.currentTarget.naturalWidth <= 1) {
            setIsMissing(true)
        }
        setIsLoaded(true)
    }

    const handleError = () => {
        setIsMissing(true)
        setIsLoaded(true)
    }

    return (
        <>
            <img
                src={src}
                style={{display: 'none'}}
                onLoad={handleLoad}
                onError={handleError}
                alt=''
            />
            {!isLoaded || isMissing ? (
                <Skeleton w={w} h={height} radius='sm' animate={!isLoaded}/>
            ) : (
                <Image
                    src={src}
                    w={w}
                    h={height}
                    fit='contain'
                    radius='sm'
                    style={{border: '1px solid var(--mantine-color-gray-3)'}}
                />
            )}
        </>
    )
}

export default BookCover
