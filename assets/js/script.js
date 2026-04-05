(function () {
    'use strict';

    // Add cover-active class to body when post has a cover image
    if (document.querySelector('.post-header.has-cover')) {
        document.body.classList.add('cover-active');
    }

    // Highlight.js theme switching
    var hljsLink = document.getElementById('hljs-theme');
    var hljsLight = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css';
    var hljsDark = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css';

    function isDark() {
        if (document.documentElement.classList.contains('theme-dark')) return true;
        if (document.documentElement.classList.contains('theme-light')) return false;
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    function updateHljsTheme() {
        if (hljsLink) {
            hljsLink.href = isDark() ? hljsDark : hljsLight;
        }
    }
    updateHljsTheme();

    // Theme toggle — cycles: System → Light → Dark → System
    var themeToggles = document.querySelectorAll('.js-theme');
    var currentTheme = localStorage.getItem('atarodo_theme') || 'system';

    function applyTheme() {
        document.documentElement.classList.remove('theme-dark', 'theme-light');
        if (currentTheme === 'dark') {
            document.documentElement.classList.add('theme-dark');
        } else if (currentTheme === 'light') {
            document.documentElement.classList.add('theme-light');
        }

        if (currentTheme === 'system') {
            localStorage.removeItem('atarodo_theme');
        } else {
            localStorage.setItem('atarodo_theme', currentTheme);
        }
        updateHljsTheme();
    }

    themeToggles.forEach(function (toggle) {
        toggle.addEventListener('click', function (e) {
            e.preventDefault();
            if (currentTheme === 'system') {
                currentTheme = 'light';
            } else if (currentTheme === 'light') {
                currentTheme = 'dark';
            } else {
                currentTheme = 'system';
            }
            applyTheme();
        });
    });

    // Mobile menu toggle (bottom sheet)
    var navMenu = document.querySelector('.nav-menu');
    var navClose = document.querySelector('.nav-close');
    var navWrapper = document.querySelector('.nav-header .nav-wrapper');

    function openMenu() {
        document.documentElement.classList.add('menu-active');
    }

    function closeMenu() {
        document.documentElement.classList.remove('menu-active');
        if (navWrapper) navWrapper.style.transform = '';
    }

    if (navMenu) navMenu.addEventListener('click', openMenu);
    if (navClose) navClose.addEventListener('click', closeMenu);

    // Swipe down to dismiss bottom sheet
    if (navWrapper) {
        var startY = 0;
        var currentY = 0;
        var dragging = false;

        navWrapper.addEventListener('touchstart', function (e) {
            startY = e.touches[0].clientY;
            dragging = true;
            navWrapper.style.transition = 'none';
        });

        navWrapper.addEventListener('touchmove', function (e) {
            if (!dragging) return;
            currentY = e.touches[0].clientY;
            var diff = currentY - startY;
            if (diff > 0) {
                navWrapper.style.transform = 'translateY(' + diff + 'px)';
            }
        });

        navWrapper.addEventListener('touchend', function () {
            if (!dragging) return;
            dragging = false;
            navWrapper.style.transition = '';
            var diff = currentY - startY;
            if (diff > 80) {
                closeMenu();
            } else {
                navWrapper.style.transform = '';
            }
            startY = 0;
            currentY = 0;
        });
    }

    window.addEventListener('resize', function () {
        closeMenu();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && document.documentElement.classList.contains('menu-active')) {
            closeMenu();
        }
    });

    // Reading progress bar
    var progressBar = document.getElementById('progress-bar');
    var postContentForProgress = document.querySelector('.post-content');
    if (document.body.classList.contains('post-template') && progressBar && postContentForProgress) {
        function updateProgress() {
            var postBottom = postContentForProgress.getBoundingClientRect().top + window.scrollY + postContentForProgress.offsetHeight;
            var viewportHeight = window.innerHeight;
            var scrollTop = window.scrollY;
            var progress = 100 - (((postBottom - (scrollTop + viewportHeight) + viewportHeight / 3) /
                (postBottom - viewportHeight + viewportHeight / 3)) * 100);
            progressBar.style.width = Math.min(Math.max(progress, 0), 100) + '%';
        }
        updateProgress();
        window.addEventListener('scroll', updateProgress);
        window.addEventListener('resize', updateProgress);
    }



    // Syntax highlighting with line numbers
    document.addEventListener('DOMContentLoaded', function () {
        if (typeof hljs !== 'undefined') {
            document.querySelectorAll('pre code').forEach(function (block) {
                hljs.highlightElement(block);
                if (!block.classList.contains('language-text') && !block.classList.contains('language-plaintext')) {
                    var lines = block.innerHTML.split(/\n(?!$)/g).length;
                    if (lines > 1) {
                        var numbers = '';
                        for (var i = 1; i < lines + 1; i++) {
                            numbers += '<span class="line">' + i + '</span>';
                        }
                        var linesEl = document.createElement('div');
                        linesEl.className = 'code-lines';
                        linesEl.innerHTML = numbers;
                        block.parentNode.appendChild(linesEl);
                        block.parentNode.classList.add('has-line-numbers');
                    }
                }
            });
        }
    });

    // Back to top button
    var backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 600) {
                backToTop.classList.add('is-visible');
            } else {
                backToTop.classList.remove('is-visible');
            }
        });
        backToTop.addEventListener('click', function (e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Copy button on code blocks
    document.querySelectorAll('.post-content pre').forEach(function (pre) {
        var btn = document.createElement('button');
        btn.className = 'code-copy-btn';
        btn.textContent = 'Copy';
        btn.addEventListener('click', function () {
            var code = pre.querySelector('code');
            var text = code ? code.textContent : pre.textContent;
            try {
                navigator.clipboard.writeText(text).then(function () {
                    btn.textContent = 'Copied!';
                    setTimeout(function () { btn.textContent = 'Copy'; }, 2000);
                });
            } catch (e) {
                var textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                btn.textContent = 'Copied!';
                setTimeout(function () { btn.textContent = 'Copy'; }, 2000);
            }
        });
        pre.style.position = 'relative';
        pre.appendChild(btn);
    });

    // Smooth anchor scrolling
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        var href = link.getAttribute('href');
        if (href.length <= 1) return;
        link.addEventListener('click', function (e) {
            try {
                var target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    history.pushState(null, null, href);
                }
            } catch (err) {}
        });
    });

    // Active TOC highlighting
    var tocLinks = document.querySelectorAll('.post-content a[href^="#"]');
    if (tocLinks.length > 2) {
        var headings = [];
        tocLinks.forEach(function (link) {
            var target = document.querySelector(link.getAttribute('href'));
            if (target) headings.push({ link: link, target: target });
        });

        if (headings.length) {
            function updateTocHighlight() {
                var scrollPos = window.scrollY + 120;
                var active = null;
                headings.forEach(function (h) {
                    if (h.target.offsetTop <= scrollPos) active = h;
                });
                headings.forEach(function (h) {
                    h.link.classList.toggle('toc-active', h === active);
                });
            }
            window.addEventListener('scroll', updateTocHighlight);
            updateTocHighlight();
        }
    }

    // Responsive video embeds
    var iframes = document.querySelectorAll('.post-content iframe[src*="youtube"], .post-content iframe[src*="vimeo"]');
    iframes.forEach(function (iframe) {
        if (!iframe.parentElement.classList.contains('video-wrap')) {
            var wrapper = document.createElement('div');
            wrapper.className = 'video-wrap';
            iframe.parentNode.insertBefore(wrapper, iframe);
            wrapper.appendChild(iframe);
        }
    });

    // Responsive tables
    var tables = document.querySelectorAll('.post-content table');
    tables.forEach(function (table) {
        if (!table.parentElement.classList.contains('table-wrap')) {
            var wrapper = document.createElement('div');
            wrapper.className = 'table-wrap';
            table.parentNode.insertBefore(wrapper, table);
            wrapper.appendChild(table);
        }
    });
})();
