import { useState, useEffect } from 'react';

export function useImagePreview(file: any) {
    const [image, setImage] = useState(null);
    useEffect(() => {
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e: any) {
                setImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    }, [file]);

    return image;
}