// Translation dictionary for English output
const translations = {
    '[JUDUL SCENE:': '[SCENE TITLE:',
    ']': ']',
    '[DESKRIPSI KARAKTER INTI]': '[CORE CHARACTER DESCRIPTION]',
    '[DETAIL SUARA KARAKTER]': '[CHARACTER VOICE DETAILS]',
    '[AKSI KARAKTER]': '[CHARACTER ACTION]',
    '[EKSPRESI KARAKTER]': '[CHARACTER EXPRESSION]',
    '[LATAR TEMPAT & WAKTU]': '[SETTING & TIME]',
    '[DETAIL VISUAL TAMBAHAN]': '[ADDITIONAL VISUAL DETAILS]',
    'Gerakan Kamera:': 'Camera Movement:',
    'Pencahayaan:': 'Lighting:',
    'Gaya Video/Art Style:': 'Video Style/Art Style:',
    'Kualitas Visual:': 'Visual Quality:',
    '[SUASANA KESELURUHAN]': '[OVERALL ATMOSPHERE]',
    '[SUARA LINGKUNGAN (AMBIENCE)]': '[ENVIRONMENT SOUND (AMBIENCE)]',
    'SOUND:': 'SOUND:',
    '[DIALOG KARAKTER]': '[CHARACTER DIALOGUE]',
    'DIALOG dalam Bahasa Indonesia:': 'DIALOGUE in Indonesian:',
    'Karakter berkata:': 'Character says:',
    '[NEGATIVE PROMPT]': '[NEGATIVE PROMPT]',
    'Hindari:': 'Avoid:'
};

// Function to translate text while preserving dialogue
function translateToEnglish(text) {
    let translated = text;
    
    // Replace section headers first
    Object.keys(translations).forEach(key => {
        translated = translated.replace(new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), translations[key]);
    });
    
    // Handle dialogue section specially - keep Indonesian dialogue content
    const dialogueMatch = translated.match(/\[CHARACTER DIALOGUE\][\s\S]*?Character says: ([\s\S]*?)(?=\[|$)/i);
    if (dialogueMatch) {
        // Dialogue content stays in Indonesian
    }
    
    // Translate common phrases in negative prompt
    const negativePromptTranslations = {
        'teks di layar': 'on-screen text',
        'subtitle': 'subtitles',
        'tulisan di video': 'text in video',
        'font': 'font',
        'logo': 'logo',
        'distorsi': 'distortion',
        'artefak': 'artifacts',
        'anomali': 'anomalies',
        'wajah ganda': 'duplicate faces',
        'anggota badan cacat': 'deformed limbs',
        'tangan tidak normal': 'abnormal hands',
        'orang tambahan': 'extra people',
        'objek mengganggu': 'distracting objects',
        'kualitas rendah': 'low quality',
        'buram': 'blurry',
        'glitch': 'glitch',
        'suara robotik': 'robotic voice',
        'suara pecah': 'broken voice'
    };
    
    // Apply negative prompt translations
    Object.keys(negativePromptTranslations).forEach(key => {
        const regex = new RegExp(key, 'gi');
        translated = translated.replace(regex, negativePromptTranslations[key]);
    });
    
    // Translate common character description phrases
    const commonTranslations = {
        'Seorang': 'A',
        'pria': 'male',
        'wanita': 'female',
        'muda': 'young',
        'berusia': 'aged',
        'tahun': 'years old',
        'Perawakan/Bentuk Tubuh:': 'Physique/Body Type:',
        'tubuh': 'body',
        'tinggi': 'height',
        'warna kulit:': 'skin color:',
        'Rambut:': 'Hair:',
        'Wajah:': 'Face:',
        'Pakaian:': 'Clothing:',
        'Dia berbicara dengan suara': 'Speaks with a voice',
        'yang hangat dan penuh semangat': 'that is warm and enthusiastic',
        'Nada:': 'Pitch:',
        'Timbre:': 'Timbre:',
        'Aksen/Logat:': 'Accent/Dialect:',
        'Cara Berbicara:': 'Speaking Style:',
        'PENTING:': 'IMPORTANT:',
        'Seluruh dialog harus dalam Bahasa Indonesia': 'All dialogue must be in Indonesian',
        'latar tempat:': 'location:',
        'Waktu:': 'Time:',
        'malam hari': 'night',
        'siang hari': 'daytime',
        'pagi hari': 'morning',
        'sore hari': 'evening',
        'mengikuti pergerakan karakter dengan gerakan yang halus dan sinematik untuk menciptakan dinamika visual yang menarik': 'following the character\'s movement with smooth and cinematic motion to create engaging visual dynamics'
    };
    
    // Extract dialogue section to preserve it
    const dialogueSection = translated.match(/\[CHARACTER DIALOGUE\][\s\S]*?(?=\[NEGATIVE PROMPT\]|$)/i);
    let dialogueText = '';
    if (dialogueSection) {
        dialogueText = dialogueSection[0];
        translated = translated.replace(dialogueSection[0], '___DIALOGUE_PLACEHOLDER___');
    }
    
    // Apply common translations
    Object.keys(commonTranslations).forEach(key => {
        const regex = new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
        translated = translated.replace(regex, commonTranslations[key]);
    });
    
    // Restore dialogue section
    if (dialogueText) {
        translated = translated.replace('___DIALOGUE_PLACEHOLDER___', dialogueText);
    }
    
    return translated;
}

// Function to generate enhanced prompt
function generateEnhancedPrompt(formData) {
    const cameraOption = document.querySelector(`#cameraMovement option[value="${formData.cameraMovement}"]`);
    const cameraMovementText = cameraOption ? cameraOption.textContent : formData.cameraMovement;
    const cameraMovementEnglish = cameraMovementText.split('(')[0].trim();
    
    let prompt = `PROMPT KARAKTER KONSISTEN VEO3.1

[JUDUL SCENE: ${formData.sceneTitle}]
[DESKRIPSI KARAKTER INTI]
${formData.characterDescription}
[DETAIL SUARA KARAKTER]
${formData.voiceDetails}
[AKSI KARAKTER]
${formData.characterAction}
[EKSPRESI KARAKTER]
${formData.characterExpression}
[LATAR TEMPAT & WAKTU]
${formData.setting}
[DETAIL VISUAL TAMBAHAN]
Gerakan Kamera: ${cameraMovementEnglish}, mengikuti pergerakan karakter dengan gerakan yang halus dan sinematik untuk menciptakan dinamika visual yang menarik.
Pencahayaan: ${formData.lighting}
Gaya Video/Art Style: ${formData.videoStyle}
Kualitas Visual: ${formData.visualQuality}
[SUASANA KESELURUHAN]
${formData.overallAtmosphere}
[SUARA LINGKUNGAN (AMBIENCE)]
${formData.ambientSound}
[DIALOG KARAKTER]
${formData.characterDialogue}
[NEGATIVE PROMPT]
${formData.negativePrompt}`;

    return prompt;
}

// Form submission handler
document.getElementById('promptForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        sceneTitle: document.getElementById('sceneTitle').value,
        characterDescription: document.getElementById('characterDescription').value,
        voiceDetails: document.getElementById('voiceDetails').value,
        characterAction: document.getElementById('characterAction').value,
        characterExpression: document.getElementById('characterExpression').value,
        setting: document.getElementById('setting').value,
        cameraMovement: document.getElementById('cameraMovement').value,
        lighting: document.getElementById('lighting').value,
        videoStyle: document.getElementById('videoStyle').value,
        visualQuality: document.getElementById('visualQuality').value,
        overallAtmosphere: document.getElementById('overallAtmosphere').value,
        ambientSound: document.getElementById('ambientSound').value,
        characterDialogue: document.getElementById('characterDialogue').value,
        negativePrompt: document.getElementById('negativePrompt').value
    };
    
    const indonesianPrompt = generateEnhancedPrompt(formData);
    const englishPrompt = translateToEnglish(indonesianPrompt);
    
    document.getElementById('outputIndonesian').value = indonesianPrompt;
    document.getElementById('outputEnglish').value = englishPrompt;
    document.getElementById('outputSection').style.display = 'block';
    
    // Set default mode to Indonesian editable
    currentEditMode = 'indonesian';
    document.getElementById('modeIndonesian').checked = true;
    updateOutputEditability();
    
    // Scroll to output section
    document.getElementById('outputSection').scrollIntoView({ behavior: 'smooth' });
});

// Copy buttons
document.getElementById('copyIndonesianBtn').addEventListener('click', function() {
    const text = document.getElementById('outputIndonesian').value;
    navigator.clipboard.writeText(text).then(() => {
        alert('Prompt Bahasa Indonesia berhasil disalin!');
    }).catch(() => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('Prompt Bahasa Indonesia berhasil disalin!');
    });
});

document.getElementById('copyEnglishBtn').addEventListener('click', function() {
    const text = document.getElementById('outputEnglish').value;
    navigator.clipboard.writeText(text).then(() => {
        alert('English prompt copied successfully!');
    }).catch(() => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('English prompt copied successfully!');
    });
});

// Change title functionality
document.getElementById('changeTitleBtn').addEventListener('click', function() {
    const newTitle = prompt('Masukkan judul baru:', document.getElementById('appTitle').textContent);
    if (newTitle && newTitle.trim()) {
        document.getElementById('appTitle').textContent = newTitle.trim();
    }
});

// Change style functionality
document.getElementById('changeStyleBtn').addEventListener('click', function() {
    const colors = prompt('Masukkan kombinasi warna (contoh: biru, hitam dan putih):', 'biru, hitam dan putih');
    if (colors && colors.trim()) {
        // Update CSS variables based on color input
        const root = document.documentElement;
        const colorMap = {
            'biru': '#4a90e2',
            'hitam': '#2c3e50',
            'putih': '#ffffff',
            'merah': '#e74c3c',
            'hijau': '#50c878',
            'kuning': '#f1c40f',
            'ungu': '#9b59b6',
            'oranye': '#e67e22',
            'pink': '#e91e63',
            'abu-abu': '#95a5a6',
            'navy': '#34495e',
            'teal': '#16a085'
        };
        
        const colorsArray = colors.toLowerCase().split(/[,\s]+dan\s+|[,\s]+/).filter(c => c.trim());
        if (colorsArray.length > 0) {
            const primaryColor = colorMap[colorsArray[0].trim()] || '#4a90e2';
            root.style.setProperty('--primary-color', primaryColor);
            
            if (colorsArray.length > 1) {
                const secondaryColor = colorMap[colorsArray[1].trim()] || '#50c878';
                root.style.setProperty('--secondary-color', secondaryColor);
            }
        }
        
        alert(`Style berhasil diubah dengan kombinasi warna: ${colors}`);
    }
});

// Reset form functionality
document.getElementById('resetBtn').addEventListener('click', function() {
    if (confirm('Apakah Anda yakin ingin mengosongkan semua kolom form?')) {
        document.getElementById('promptForm').reset();
        document.getElementById('outputSection').style.display = 'none';
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

// Language mode toggle functionality
let currentEditMode = 'indonesian'; // 'indonesian' or 'english'

document.getElementById('modeIndonesian').addEventListener('change', function() {
    if (this.checked) {
        currentEditMode = 'indonesian';
        updateOutputEditability();
    }
});

document.getElementById('modeEnglish').addEventListener('change', function() {
    if (this.checked) {
        currentEditMode = 'english';
        updateOutputEditability();
    }
});

function updateOutputEditability() {
    const indonesianTextarea = document.getElementById('outputIndonesian');
    const englishTextarea = document.getElementById('outputEnglish');
    const indonesianLabel = document.getElementById('outputIndonesianLabel');
    const englishLabel = document.getElementById('outputEnglishLabel');
    
    if (currentEditMode === 'indonesian') {
        // Indonesian editable, English readonly
        indonesianTextarea.removeAttribute('readonly');
        indonesianTextarea.style.background = 'white';
        indonesianTextarea.style.cursor = 'text';
        indonesianLabel.textContent = 'Bahasa Indonesia (Dapat Diedit)';
        
        englishTextarea.setAttribute('readonly', 'readonly');
        englishTextarea.style.background = '#f8f9fa';
        englishTextarea.style.cursor = 'default';
        englishLabel.textContent = 'English (Final - Tidak Dapat Diedit)';
    } else {
        // English editable, Indonesian readonly
        englishTextarea.removeAttribute('readonly');
        englishTextarea.style.background = 'white';
        englishTextarea.style.cursor = 'text';
        englishLabel.textContent = 'English (Dapat Diedit)';
        
        indonesianTextarea.setAttribute('readonly', 'readonly');
        indonesianTextarea.style.background = '#f8f9fa';
        indonesianTextarea.style.cursor = 'default';
        indonesianLabel.textContent = 'Bahasa Indonesia (Final - Tidak Dapat Diedit)';
    }
}

// Update English output when Indonesian is edited
document.getElementById('outputIndonesian').addEventListener('input', function() {
    if (currentEditMode === 'indonesian') {
        const indonesianText = this.value;
        const englishText = translateToEnglish(indonesianText);
        document.getElementById('outputEnglish').value = englishText;
    }
});

// Reverse translation dictionary (English to Indonesian)
const reverseTranslations = {
    '[SCENE TITLE:': '[JUDUL SCENE:',
    '[CORE CHARACTER DESCRIPTION]': '[DESKRIPSI KARAKTER INTI]',
    '[CHARACTER VOICE DETAILS]': '[DETAIL SUARA KARAKTER]',
    '[CHARACTER ACTION]': '[AKSI KARAKTER]',
    '[CHARACTER EXPRESSION]': '[EKSPRESI KARAKTER]',
    '[SETTING & TIME]': '[LATAR TEMPAT & WAKTU]',
    '[ADDITIONAL VISUAL DETAILS]': '[DETAIL VISUAL TAMBAHAN]',
    'Camera Movement:': 'Gerakan Kamera:',
    'Lighting:': 'Pencahayaan:',
    'Video Style/Art Style:': 'Gaya Video/Art Style:',
    'Visual Quality:': 'Kualitas Visual:',
    '[OVERALL ATMOSPHERE]': '[SUASANA KESELURUHAN]',
    '[ENVIRONMENT SOUND (AMBIENCE)]': '[SUARA LINGKUNGAN (AMBIENCE)]',
    '[CHARACTER DIALOGUE]': '[DIALOG KARAKTER]',
    'DIALOGUE in Indonesian:': 'DIALOG dalam Bahasa Indonesia:',
    'Character says:': 'Karakter berkata:',
    '[NEGATIVE PROMPT]': '[NEGATIVE PROMPT]',
    'Avoid:': 'Hindari:',
    'on-screen text': 'teks di layar',
    'subtitles': 'subtitle',
    'text in video': 'tulisan di video',
    'distortion': 'distorsi',
    'artifacts': 'artefak',
    'anomalies': 'anomali',
    'duplicate faces': 'wajah ganda',
    'deformed limbs': 'anggota badan cacat',
    'abnormal hands': 'tangan tidak normal',
    'extra people': 'orang tambahan',
    'distracting objects': 'objek mengganggu',
    'low quality': 'kualitas rendah',
    'blurry': 'buram',
    'robotic voice': 'suara robotik',
    'broken voice': 'suara pecah'
};

// Function to translate English back to Indonesian (basic reverse translation)
function translateToIndonesian(text) {
    let translated = text;
    
    // Replace section headers
    Object.keys(reverseTranslations).forEach(key => {
        translated = translated.replace(new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), reverseTranslations[key]);
    });
    
    // Extract dialogue section to preserve it
    const dialogueSection = translated.match(/\[DIALOG KARAKTER\][\s\S]*?(?=\[NEGATIVE PROMPT\]|$)/i);
    let dialogueText = '';
    if (dialogueSection) {
        dialogueText = dialogueSection[0];
        translated = translated.replace(dialogueSection[0], '___DIALOGUE_PLACEHOLDER___');
    }
    
    // Basic reverse translations for common phrases
    const commonReverseTranslations = {
        'A ': 'Seorang ',
        'male': 'pria',
        'female': 'wanita',
        'young': 'muda',
        'aged': 'berusia',
        'years old': 'tahun',
        'Physique/Body Type:': 'Perawakan/Bentuk Tubuh:',
        'body': 'tubuh',
        'height': 'tinggi',
        'skin color:': 'warna kulit:',
        'Hair:': 'Rambut:',
        'Face:': 'Wajah:',
        'Clothing:': 'Pakaian:',
        'Speaks with a voice': 'Dia berbicara dengan suara',
        'that is warm and enthusiastic': 'yang hangat dan penuh semangat',
        'Pitch:': 'Nada:',
        'Timbre:': 'Timbre:',
        'Accent/Dialect:': 'Aksen/Logat:',
        'Speaking Style:': 'Cara Berbicara:',
        'IMPORTANT:': 'PENTING:',
        'All dialogue must be in Indonesian': 'Seluruh dialog harus dalam Bahasa Indonesia',
        'location:': 'latar tempat:',
        'Time:': 'Waktu:',
        'night': 'malam hari',
        'daytime': 'siang hari',
        'morning': 'pagi hari',
        'evening': 'sore hari',
        'following the character\'s movement with smooth and cinematic motion to create engaging visual dynamics': 'mengikuti pergerakan karakter dengan gerakan yang halus dan sinematik untuk menciptakan dinamika visual yang menarik'
    };
    
    // Apply common reverse translations
    Object.keys(commonReverseTranslations).forEach(key => {
        const regex = new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
        translated = translated.replace(regex, commonReverseTranslations[key]);
    });
    
    // Restore dialogue section
    if (dialogueText) {
        translated = translated.replace('___DIALOGUE_PLACEHOLDER___', dialogueText);
    }
    
    return translated;
}

// Update Indonesian output when English is edited
document.getElementById('outputEnglish').addEventListener('input', function() {
    if (currentEditMode === 'english') {
        const englishText = this.value;
        const indonesianText = translateToIndonesian(englishText);
        document.getElementById('outputIndonesian').value = indonesianText;
    }
});

