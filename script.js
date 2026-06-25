// ============================================
// script.js - جميع الوظائف البرمجية للموقع
// ============================================

// ===== دوال مساعدة =====
function showAlert(containerId, message, type = 'danger') {
    const alertDiv = document.getElementById(containerId);
    if (alertDiv) {
        alertDiv.className = `alert alert-${type}`;
        alertDiv.style.display = 'block';
        alertDiv.textContent = message;
    }
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ===== قائمة الموبايل =====
function toggleMobileMenu() {
    const nav = document.querySelector('.main-nav');
    if (nav) {
        nav.classList.toggle('mobile-open');
    }
}

// ============================================
// ===== صفحة تسجيل الدخول =====
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ------ نموذج تسجيل الدخول ------
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            const username = document.getElementById('gasim');
            const password = document.getElementById('123456');
            let isValid = true;
            
            document.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');
            username.classList.remove('error');
            password.classList.remove('error');
            
            if (!username.value.trim()) {
                username.classList.add('error');
                const errorEl = document.getElementById('usernameError');
                if (errorEl) errorEl.style.display = 'block';
                isValid = false;
            }
            
            if (!password.value.trim()) {
                password.classList.add('error');
                const errorEl = document.getElementById('passwordError');
                if (errorEl) errorEl.style.display = 'block';
                isValid = false;
            }
            
            if (!isValid) {
                e.preventDefault();
            }
        });
    }
    
    // ------ نموذج التسجيل ------
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            const username = document.getElementById('username');
            const email = document.getElementById('email');
            const password = document.getElementById('password');
            const confirm = document.getElementById('confirm_password');
            let isValid = true;
            
            document.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');
            document.querySelectorAll('.form-group input').forEach(el => el.classList.remove('error'));
            
            if (username.value.trim().length < 3) {
                username.classList.add('error');
                const errorEl = document.getElementById('usernameError');
                if (errorEl) {
                    errorEl.textContent = 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل';
                    errorEl.style.display = 'block';
                }
                isValid = false;
            }
            
            if (!isValidEmail(email.value.trim())) {
                email.classList.add('error');
                const errorEl = document.getElementById('emailError');
                if (errorEl) {
                    errorEl.textContent = 'يرجى إدخال بريد إلكتروني صحيح';
                    errorEl.style.display = 'block';
                }
                isValid = false;
            }
            
            if (password.value.length < 6) {
                password.classList.add('error');
                const errorEl = document.getElementById('passwordError');
                if (errorEl) {
                    errorEl.textContent = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
                    errorEl.style.display = 'block';
                }
                isValid = false;
            }
            
            if (password.value !== confirm.value) {
                confirm.classList.add('error');
                const errorEl = document.getElementById('confirmError');
                if (errorEl) {
                    errorEl.textContent = 'كلمة المرور غير متطابقة';
                    errorEl.style.display = 'block';
                }
                isValid = false;
            }
            
            if (!isValid) {
                e.preventDefault();
            }
        });
    }
    
    // ------ عرض رسائل من URL ------
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    const success = urlParams.get('success');
    const alertDiv = document.getElementById('alertMessage');
    
    if (alertDiv) {
        if (error) {
            alertDiv.className = 'alert alert-danger';
            alertDiv.style.display = 'block';
            const messages = {
                'invalid': '❌ اسم المستخدم أو كلمة المرور غير صحيحة',
                'empty': '❌ يرجى ملء جميع الحقول',
                'not_found': '❌ المستخدم غير موجود',
                'db_error': '❌ حدث خطأ في قاعدة البيانات'
            };
            alertDiv.textContent = messages[error] || '❌ حدث خطأ، يرجى المحاولة مرة أخرى';
        }
        
        if (success === 'registered') {
            alertDiv.className = 'alert alert-success';
            alertDiv.style.display = 'block';
            alertDiv.textContent = '✅ تم التسجيل بنجاح! يرجى تسجيل الدخول';
        }
    }
    
    // ------ جلب اسم المستخدم في Dashboard ------
    const welcomeUser = document.getElementById('welcomeUser');
    if (welcomeUser) {
        fetch('test.php?action=get_user')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    welcomeUser.textContent = '👤 ' + data.username;
                }
            })
            .catch(() => {});
    }
    
    // ------ تأثير ظهور البطاقات ------
    const cards = document.querySelectorAll('.feature-card, .testimonial-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 200 + (index * 100));
    });
});

// ============================================
// ===== صفحة الاختبار =====
// ============================================

let currentQuestion = 0;
let userAnswers = {};
let totalQuestions = 0;
let questions = [];

function loadQuestions() {
    console.log('🔄 جاري تحميل الأسئلة...');
    
    fetch('test.php?action=get_questions')
        .then(response => {
            if (!response.ok) {
                throw new Error('خطأ في الشبكة: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log('📊 البيانات المستلمة:', data);
            
            if (data.success) {
                questions = data.questions;
                totalQuestions = data.questions.length;
                console.log('✅ تم تحميل ' + totalQuestions + ' سؤال');
                
                if (totalQuestions === 0) {
                    alert('⚠️ لا توجد أسئلة في قاعدة البيانات!');
                    return;
                }
                
                renderQuestion(0);
            } else {
                alert('❌ حدث خطأ في تحميل الأسئلة: ' + (data.message || 'خطأ غير معروف'));
            }
        })
        .catch(error => {
            console.error('❌ خطأ:', error);
            alert('❌ حدث خطأ في الاتصال بالخادم: ' + error.message);
        });
}

function renderQuestion(index) {
    if (!questions || questions.length === 0) return;
    
    const question = questions[index];
    const container = document.getElementById('optionsContainer');
    const questionText = document.getElementById('questionText');
    const questionNumber = document.getElementById('questionNumber');
    const questionCounter = document.getElementById('questionCounter');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');

    questionNumber.textContent = `📝 السؤال ${index + 1}`;
    questionText.textContent = question.question;
    questionCounter.textContent = `${index + 1} / ${totalQuestions}`;

    const progress = ((index + 1) / totalQuestions) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
    document.getElementById('progressLabel').textContent = `السؤال ${index + 1} من ${totalQuestions}`;
    document.getElementById('progressPercent').textContent = Math.round(progress) + '%';

    const labels = ['أ', 'ب', 'ج', 'د', 'ه', 'و'];
    let optionsHTML = '';
    question.options.forEach((option, i) => {
        const checked = userAnswers[question.id] === i ? 'checked' : '';
        const selected = userAnswers[question.id] === i ? 'selected' : '';
        optionsHTML += `
            <div class="option ${selected}" data-option="${i}" onclick="selectOption(${question.id}, ${i})">
                <input type="radio" name="question_${question.id}" value="${i}" ${checked}>
                <span class="option-label">${labels[i]}</span>
                <span class="option-text">${option}</span>
            </div>
        `;
    });
    container.innerHTML = optionsHTML;

    prevBtn.disabled = index === 0;
    
    if (index === totalQuestions - 1) {
        nextBtn.style.display = 'none';
        submitBtn.classList.remove('hidden');
    } else {
        nextBtn.style.display = 'block';
        submitBtn.classList.add('hidden');
    }

    updateScore();
}

window.selectOption = function(questionId, optionIndex) {
    userAnswers[questionId] = optionIndex;
    
    const options = document.querySelectorAll('.option');
    options.forEach(opt => {
        opt.classList.remove('selected');
        const radio = opt.querySelector('input[type="radio"]');
        if (radio && parseInt(radio.value) === optionIndex) {
            opt.classList.add('selected');
            radio.checked = true;
        }
    });

    updateScore();
};

function updateScore() {
    let score = 0;
    for (const [qId, answer] of Object.entries(userAnswers)) {
        const question = questions.find(q => q.id == qId);
        if (question && question.correct === answer) {
            score++;
        }
    }
    document.getElementById('scoreDisplay').textContent = `${score} نقطة`;
}

function nextQuestion() {
    if (currentQuestion < totalQuestions - 1) {
        currentQuestion++;
        renderQuestion(currentQuestion);
    }
}

function prevQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        renderQuestion(currentQuestion);
    }
}

function submitTest() {
    console.log('🔄 جاري إنهاء الاختبار...');
    
    const answered = Object.keys(userAnswers).length;
    const total = totalQuestions || 15;
    
    if (answered < total) {
        const confirmMsg = `⚠️ لقد أجبت على ${answered} من ${total} أسئلة.\nهل تريد إنهاء الاختبار؟`;
        if (!confirm(confirmMsg)) {
            return;
        }
    }

    let score = 0;
    const answers = {};
    for (const [qId, answer] of Object.entries(userAnswers)) {
        const question = questions.find(q => q.id == qId);
        if (question && question.correct === answer) {
            score++;
            answers[qId] = true;
        } else {
            answers[qId] = false;
        }
    }

    console.log('📊 النتيجة:', score, 'من', total);

    fetch('test.php?action=submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            score: score,
            total: total,
            answers: answers
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = `results.html?score=${score}&total=${total}`;
        } else {
            alert('❌ حدث خطأ في حفظ النتيجة: ' + (data.message || 'خطأ غير معروف'));
        }
    })
    .catch(error => {
        console.error('❌ خطأ:', error);
        alert('❌ حدث خطأ في الاتصال بالخادم: ' + error.message);
    });
}

// ربط أحداث الاختبار
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('questionCard')) {
        const nextBtn = document.getElementById('nextBtn');
        const prevBtn = document.getElementById('prevBtn');
        const submitBtn = document.getElementById('submitBtn');
        
        if (nextBtn) nextBtn.addEventListener('click', nextQuestion);
        if (prevBtn) prevBtn.addEventListener('click', prevQuestion);
        if (submitBtn) submitBtn.addEventListener('click', submitTest);
        
        loadQuestions();
    }
});

// ============================================
// ===== صفحة النتائج =====
// ============================================

if (document.querySelector('.results-card')) {
    document.addEventListener('DOMContentLoaded', function() {
        const urlParams = new URLSearchParams(window.location.search);
        const score = parseInt(urlParams.get('score')) || 0;
        const total = parseInt(urlParams.get('total')) || 15;

        const percentage = (score / total) * 100;
        let iqScore = Math.round((score / total) * 100 + 50);
        if (iqScore < 50) iqScore = 50;
        if (iqScore > 150) iqScore = 150;

        let iqLevel, iqDescription, icon;
        if (iqScore >= 130) {
            iqLevel = 'عبقري 🧠';
            icon = '🌟';
            iqDescription = '⭐ أنت عبقري! قدراتك العقلية استثنائية.';
        } else if (iqScore >= 115) {
            iqLevel = 'متفوق ⭐';
            icon = '🏆';
            iqDescription = '🏆 نتيجة ممتازة! أنت في أعلى 15% من السكان.';
        } else if (iqScore >= 100) {
            iqLevel = 'جيد جداً 👍';
            icon = '📈';
            iqDescription = '👍 نتيجة جيدة! أنت في المستوى المتوسط العالي.';
        } else if (iqScore >= 80) {
            iqLevel = 'متوسط 📚';
            icon = '🔆';
            iqDescription = '📚 أنت في المستوى المتوسط. يمكنك التطوير بالتدريب.';
        } else {
            iqLevel = 'يحتاج للتحسين 💪';
            icon = '🌱';
            iqDescription = '🌱 لا تقلق! الذكاء قابل للتطوير بالتدريب المنتظم.';
        }

        document.getElementById('resultIcon').textContent = icon;
        document.getElementById('iqScore').textContent = iqScore;
        document.getElementById('iqLevel').textContent = iqLevel;
        document.getElementById('iqDescription').textContent = iqDescription;
        document.getElementById('correctCount').textContent = score;
        document.getElementById('wrongCount').textContent = total - score;
        document.getElementById('percentageDisplay').textContent = Math.round(percentage) + '%';
        document.getElementById('totalQuestions').textContent = total;

        const barWidth = Math.min((iqScore - 50) / 100 * 100, 100);
        document.getElementById('iqBarFill').style.width = barWidth + '%';
        document.getElementById('iqBarMarker').style.left = barWidth + '%';
    });
}

// ============================================
// ===== دوال الأزرار =====
// ============================================

window.logout = function() {
    if (confirm('⚠️ هل أنت متأكد من تسجيل الخروج؟')) {
        window.location.href = 'logout.php';
    }
};

window.retryTest = function() {
    if (confirm('🔄 هل تريد إعادة اختبار الذكاء؟')) {
        window.location.href = 'test.html';
    }
};

window.goToDashboard = function() {
    window.location.href = 'dashboard.html';
};

window.sendMessage = function(e) {
    e.preventDefault();
    const name = document.getElementById('contactName').value;
    const msgDiv = document.getElementById('formMessage');
    msgDiv.className = 'form-message success';
    msgDiv.textContent = `✅ شكراً لك ${name}! تم إرسال رسالتك بنجاح. سنتواصل معك قريباً.`;
    document.getElementById('contactForm').reset();
    
    setTimeout(() => {
        msgDiv.style.display = 'none';
    }, 5000);
};

console.log('✅ تم تحميل script.js بنجاح');