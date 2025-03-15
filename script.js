const generateButton = document.getElementById('generate-button');
const textInput = document.getElementById('text-input');
const canvas = document.getElementById('canvas');
const videoOutput = document.getElementById('video-output');
const ctx = canvas.getContext('2d');

// تحميل الخلفيات والموسيقى
const backgroundImages = {
    'background1': 'background1.jpg',  // استبدل المسار بالمسار الفعلي للصورة
    'background2': 'background2.jpg',  // استبدل المسار بالمسار الفعلي للصورة
    'none': null
};

const musicTracks = {
    'music1': 'music1.mp3',  // استبدل بالمسار الفعلي للموسيقى
    'music2': 'music2.mp3',  // استبدل بالمسار الفعلي للموسيقى
    'none': null
};

// إنشاء الفيديو باستخدام Canvas
generateButton.addEventListener('click', () => {
    const text = textInput.value.trim();
    if (text === "") {
        alert("يرجى إدخال نص لتحويله إلى فيديو");
        return;
    }

    const selectedBackground = document.getElementById('background-select').value;
    const selectedMusic = document.getElementById('music-select').value;

    // إعداد تسجيل الفيديو
    const stream = canvas.captureStream(30); // 30 إطار في الثانية
    const mediaRecorder = new MediaRecorder(stream);
    const chunks = [];
    
    mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        videoOutput.src = url;
        videoOutput.style.display = 'block';
    };

    // تشغيل الموسيقى (إن وجدت)
    let audio;
    if (selectedMusic !== 'none') {
        audio = new Audio(musicTracks[selectedMusic]);
        audio.loop = true;  // تشغيل الموسيقى في حلقة مستمرة
        audio.play();
    }

    // بدء التسجيل
    mediaRecorder.start();

    // رسم النص على Canvas
    let frameCount = 0;
    const drawFrame = () => {
        if (frameCount < 200) { // تعيين عدد الإطارات (حوالي 10 ثواني)
            frameCount++;
            ctx.clearRect(0, 0, canvas.width, canvas.height); // مسح الإطار الحالي
            
            // إضافة الخلفية
            const backgroundImage = backgroundImages[selectedBackground];
            if (backgroundImage) {
                const img = new Image();
                img.src = backgroundImage;
                img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            }

            // تأثيرات النص
            ctx.fillStyle = '#fff';
            ctx.font = '30px Arial';
            ctx.fillText(text, 50, 240); // رسم النص على الشاشة

            // إضافة تأثيرات (تغيير اللون تدريجيًا)
            if (frameCount % 50 === 0) {
                ctx.fillStyle = ctx.fillStyle === '#fff' ? '#ff0' : '#fff';
            }

            requestAnimationFrame(drawFrame); // رسم الإطار التالي
        } else {
            mediaRecorder.stop(); // التوقف عن التسجيل
            if (audio) {
                audio.pause();  // إيقاف الموسيقى بعد الانتهاء
            }
        }
    };

    drawFrame();
});
