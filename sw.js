// Tên cache và danh sách tài nguyên cần cache
const CACHE_NAME = 'my-pwa-cache-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/Page2.html',
  '/Page3.html
  '/images/html.png',
];

// Bước 1: Cài đặt Service Worker và cache tài nguyên
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Đã cache các tài nguyên cốt lõi');
        return cache.addAll(ASSETS);
      })
      .catch((err) => {
        console.log('Lỗi khi cache tài nguyên:', err);
      })
  );
});

// Bước 2: Kích hoạt Service Worker và xóa cache cũ
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Xóa cache cũ:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Bước 3: Chặn các request và trả về từ cache/network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Trả về response từ cache nếu có
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Nếu không có trong cache, fetch từ network
        return fetch(event.request)
          .then((response) => {
            // Cache response mới nếu request thành công
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(() => {
            // Fallback khi offline (ví dụ: hiển thị trang offline)
            return caches.match('/offline.html');
          });
      })
  );
});

// Bước 4: Xử lý Background Sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(
      // Gọi hàm đồng bộ dữ liệu
      syncDataWithServer()
        .then(() => console.log('Đồng bộ thành công!'))
        .catch((err) => console.error('Lỗi đồng bộ:', err))
    );
  }
});

// Hàm đồng bộ dữ liệu (ví dụ)
function syncDataWithServer() {
  return new Promise((resolve, reject) => {
    // Giả lập gửi dữ liệu lên server
    setTimeout(() => {
      console.log('Dữ liệu đã được đồng bộ');
      resolve();
    }, 2000);
  });
}