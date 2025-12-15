// Cropper Modal
// Based on cropperjs-1.6.2

let cropper;
const fileInput = document.getElementById('id_picture');
const cropperModal = document.getElementById('cropperModal');
const cropperPreview = document.getElementById('cropperPreview');
const uploadedAvatar = document.getElementById('uploadedAvatar');
const rotationAngleInput = document.getElementById('rotationAngle');
const outputWidth = document.getElementById('outputWidth');
const outputQuality = document.getElementById('outputQuality');
const outputSizeDisplay = document.getElementById('outputSize');
const originalInfoDisplay = document.getElementById('originalInfo');
const cropBoxInfoDisplay = document.getElementById('cropBoxInfo');

let originalFileType = 'image/jpeg';

fileInput.addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (!file) return;

    originalFileType = file.type;

    const reader = new FileReader();
    reader.onload = function (e) {
        cropperPreview.src = e.target.result;
        cropperModal.style.display = 'block';

        if (cropper) cropper.destroy();
        cropper = new Cropper(cropperPreview, {
            aspectRatio: 1,
            viewMode: 1,
            zoomOnWheel: false,
            responsive: true,
            autoCropArea: 1,
            minCropBoxWidth: 50,
            minCropBoxHeight: 50,
            ready() {
                const img = cropper.image;
                originalInfoDisplay.textContent = `Original: ${img.naturalWidth} x ${img.naturalHeight}px | ${Math.round(file.size / 1024)} KB`;
                if (img.naturalWidth < 300 || img.naturalHeight < 300) {
                    outputWidth.value = Math.min(img.naturalWidth, img.naturalHeight);
                }
                outputWidth.max = Math.min(img.naturalWidth, img.naturalHeight);
                updateOutputSize();
            },
            crop(event) {
                const data = event.detail;
                cropBoxInfoDisplay.textContent = `Crop: ${Math.round(data.width)} x ${Math.round(data.height)}px`;
                updateOutputSize();
            }
        });
    };
    reader.readAsDataURL(file);
});

function rotateImage(deg) {
    if (cropper) cropper.rotate(deg);
}

rotationAngleInput.addEventListener('input', function () {
    const angle = parseFloat(rotationAngleInput.value);
    if (cropper) cropper.rotateTo(angle);
    updateOutputSize();
});

function resetCrop() {
    if (cropper) cropper.reset();
    rotationAngleInput.value = 0;
    //updateOutputSize();
}

function updateOutputSize() {
    if (!cropper) return;

    const width = parseInt(outputWidth.value);
    const qualityInput = document.getElementById('outputQuality');
    const quality = parseFloat(qualityInput.value);

    const canvas = cropper.getCroppedCanvas({ width });
    if (!canvas) {
        outputSizeDisplay.textContent = 'Estimated size: N/A';
        return;
    }

    const format = originalFileType.toLowerCase();
    const supportsQuality = format === 'image/jpeg' || format === 'image/webp';

    // Hide or show quality slider depending on format
    qualityInput.parentElement.style.display = supportsQuality ? 'inline-block' : 'none';

    canvas.toBlob(blob => {
        if (blob) {
            const sizeKB = blob.size / 1024;
            outputSizeDisplay.textContent = `Estimated size: ${sizeKB.toFixed(1)} KB` +
                (supportsQuality ? ` (Quality: ${quality})` : ` (Lossless format)`);
        } else {
            outputSizeDisplay.textContent = 'Estimated size: N/A';
        }
    }, format, supportsQuality ? quality : undefined);
}


outputWidth.addEventListener('input', updateOutputSize);
outputQuality.addEventListener('input', updateOutputSize);

document.getElementById('cancelCrop').addEventListener('click', function () {
    cropper.destroy();
    cropperModal.style.display = 'none';
    fileInput.value = '';
});

document.getElementById('confirmCrop').addEventListener('click', function () {
    let quality = parseFloat(outputQuality.value);
    const width = parseInt(outputWidth.value);
    const tryCompress = () => {
        const canvas = cropper.getCroppedCanvas({ width });
        canvas.toBlob(function (blob) {
            const sizeKB = blob.size / 1024;
            if (sizeKB <= 100 || quality <= 0.3) {
                const extension = originalFileType.split('/')[1];
                const croppedFile = new File([blob], `cropped.${extension}`, { type: originalFileType });
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(croppedFile);
                fileInput.files = dataTransfer.files;
                uploadedAvatar.src = URL.createObjectURL(blob);
                cropper.destroy();
                cropperModal.style.display = 'none';
            } else {
                quality -= 0.05;
                outputQuality.value = quality.toFixed(2);
                updateOutputSize();
                tryCompress();
            }
        }, originalFileType, quality);
    };
    tryCompress();
});