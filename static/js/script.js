// Dark mode toggle
document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            darkModeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️ Light Mode' : '🌙 Dark Mode';
        });
    }

    // Event effects (e.g., Christmas snowballs)
    const eventEffects = document.getElementById('eventEffects');
    if (eventEffects) {
        fetch('/api/event')  // Assuming an endpoint for event data; add to app.py if needed
            .then(res => res.json())
            .then(data => {
                if (data.event === 'christmas') {
                    for (let i = 0; i < 50; i++) {
                        const snowball = document.createElement('div');
                        snowball.className = 'snowball';
                        snowball.style.left = Math.random() * 100 + '%';
                        snowball.style.animationDelay = Math.random() * 5 + 's';
                        eventEffects.appendChild(snowball);
                    }
                } else if (data.event === 'newyear') {
                    for (let i = 0; i < 20; i++) {
                        const firework = document.createElement('div');
                        firework.className = 'firework';
                        firework.style.left = Math.random() * 100 + '%';
                        firework.style.top = Math.random() * 50 + '%';
                        firework.style.animationDelay = Math.random() * 2 + 's';
                        eventEffects.appendChild(firework);
                    }
                }
            })
            .catch(() => {});  // Ignore errors
    }

    // Share panel logic
    const normalBtn = document.getElementById('normalBtn');
    const premiumBtn = document.getElementById('premiumBtn');
    const delayDiv = document.getElementById('delay');
    const premiumKeyDiv = document.getElementById('premiumKey');
    const logsDiv = document.getElementById('logs');

    if (normalBtn) {
        normalBtn.addEventListener('click', () => {
            delayDiv.style.display = 'block';
            premiumKeyDiv.style.display = 'none';
            share('normal');
        });
    }

    if (premiumBtn) {
        premiumBtn.addEventListener('click', () => {
            premiumKeyDiv.style.display = 'block';
            delayDiv.style.display = 'none';
            share('premium');
        });
    }

    function share(mode) {
        const link = document.getElementById('link').value;
        const limit = document.getElementById('limit').value;
        const delay = document.getElementById('delayInput') ? document.getElementById('delayInput').value : 0;
        const key = document.getElementById('key') ? document.getElementById('key').value : '';

        fetch('/api/share', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mode, link, limit, delay, key })
        })
        .then(res => res.json())
        .then(data => {
            logsDiv.innerHTML = `<p>${data.message || data.error}</p>`;
            updateLogs();
        })
        .catch(err => {
            logsDiv.innerHTML = `<p>Error: ${err.message}</p>`;
        });
    }

    function updateLogs() {
        fetch('/api/logs')
            .then(res => res.json())
            .then(logs => {
                logsDiv.innerHTML = logs.map(log => `<p>${log}</p>`).join('');
            });
    }

    // Admin panel logic
    const updateKeyBtn = document.getElementById('updateKey');
    const updateEventBtn = document.getElementById('updateEvent');
    const clearLogsBtn = document.getElementById('clearLogs');
    const setCookiesBtn = document.getElementById('setCookies');
    const logsList = document.getElementById('logsList');

    if (updateKeyBtn) {
        updateKeyBtn.addEventListener('click', () => {
            const key = document.getElementById('keyInput').value;
            fetch('/api/admin/update_key', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key })
            })
            .then(res => res.json())
            .then(data => alert(data.message));
        });
    }

    if (updateEventBtn) {
        updateEventBtn.addEventListener('click', () => {
            const event = document.getElementById('eventSelect').value;
            const greeting = document.getElementById('greetingInput').value;
            fetch('/api/admin/update_event', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ event, greeting })
            })
            .then(res => res.json())
            .then(data => alert(data.message));
        });
    }

    if (clearLogsBtn) {
        clearLogsBtn.addEventListener('click', () => {
            fetch('/api/admin/clear_logs', { method: 'POST' })
            .then(res => res.json())
            .then(data => alert(data.message));
        });
    }

    if (setCookiesBtn) {
        setCookiesBtn.addEventListener('click', () => {
            const cookies = document.getElementById('cookiesInput').value.split('\n');
            fetch('/api/admin/set_cookies', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cookies })
            })
            .then(res => res.json())
            .then(data => alert(data.message));
        });
    }

    if (logsList) {
        updateLogs();
        setInterval(updateLogs, 5000);  // Real-time logs every 5s
    }
});