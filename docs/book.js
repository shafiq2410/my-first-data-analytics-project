document.addEventListener('DOMContentLoaded', () => {
  // 1. Apply Saved Theme & Font Size
  const savedTheme = localStorage.getItem('book_theme') || 'light';
  const savedSize = parseInt(localStorage.getItem('book_font_size')) || 19;
  document.documentElement.setAttribute('data-theme', savedTheme);
  document.documentElement.style.setProperty('--font-size', `${savedSize}px`);

  const themeSelect = document.getElementById('theme-select');
  if (themeSelect) {
    themeSelect.value = savedTheme;
    themeSelect.addEventListener('change', (e) => {
      document.documentElement.setAttribute('data-theme', e.target.value);
      localStorage.setItem('book_theme', e.target.value);
    });
  }

  // 2. Font Size Controls
  let currentSize = savedSize;
  const incBtn = document.getElementById('font-inc');
  const decBtn = document.getElementById('font-dec');

  if (incBtn) {
    incBtn.onclick = () => {
      if (currentSize < 26) {
        currentSize += 2;
        document.documentElement.style.setProperty('--font-size', `${currentSize}px`);
        localStorage.setItem('book_font_size', currentSize);
      }
    };
  }

  if (decBtn) {
    decBtn.onclick = () => {
      if (currentSize > 15) {
        currentSize -= 2;
        document.documentElement.style.setProperty('--font-size', `${currentSize}px`);
        localStorage.setItem('book_font_size', currentSize);
      }
    };
  }

  // 3. Auto Calculate Reading Time
  const content = document.querySelector('.book-content');
  const timeEl = document.getElementById('reading-time');
  if (content && timeEl) {
    const words = content.innerText.trim().split(/\s+/).length;
    timeEl.textContent = `${Math.max(1, Math.ceil(words / 200))} min read`;
  }

  // 4. Add Copy Button to All <pre> Code Blocks
  document.querySelectorAll('pre').forEach((block) => {
    const btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.textContent = 'Copy';
    btn.onclick = () => {
      navigator.clipboard.writeText(block.innerText.replace('Copy', '').trim());
      btn.textContent = 'Copied!';
      setTimeout(() => (btn.textContent = 'Copy'), 1500);
    };
    block.appendChild(btn);
  });

  // 5. Bookmarking System
  const bookmarkBtn = document.getElementById('bookmark-btn');
  const resumeBtn = document.getElementById('resume-btn');
  const savedBookmark = JSON.parse(localStorage.getItem('book_bookmark'));

  if (bookmarkBtn) {
    if (savedBookmark && savedBookmark.url === window.location.pathname) {
      bookmarkBtn.textContent = '★ Bookmarked';
    }
    bookmarkBtn.onclick = () => {
      localStorage.setItem('book_bookmark', JSON.stringify({
        url: window.location.pathname,
        title: document.title,
        scrollY: window.scrollY
      }));
      bookmarkBtn.textContent = '★ Bookmarked';
    };
  }

  if (resumeBtn && savedBookmark) {
    resumeBtn.style.display = 'inline-block';
    resumeBtn.onclick = () => {
      window.location.href = savedBookmark.url;
    };
  }

  // Restore scroll position if returning to bookmarked page
  if (savedBookmark && savedBookmark.url === window.location.pathname && savedBookmark.scrollY > 0) {
    window.scrollTo(0, savedBookmark.scrollY);
  }

  // 6. Scroll Progress Bar
  const progressBar = document.getElementById('progress-bar');
  window.addEventListener('scroll', () => {
    if (!progressBar) return;
    const scrollTop = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    progressBar.style.width = height > 0 ? `${(scrollTop / height) * 100}%` : '0%';
  });
});