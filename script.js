// マップの初期化
const map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: -5,
    maxZoom: 5
});

// マップ定義
const maps = {
    mondstadt: {
        areas: {
            mondstadt: {
                name: 'モンド',
                layers: {
                    main: { name: 'モンドマップ', image: 'image/mond.png', bounds: [[0, 0], [1626, 2703]] }
                }
            },
            dragonspine: {
                name: 'ドラゴンスパイン',
                layers: {
                    main: { name: 'ドラゴンスパインマップ', image: 'image/placeholder.png', bounds: [[0, 0], [1626, 2703]] }
                }
            }
        }
    },
    liyue: {
        areas: {
            liyue: {
                name: '璃月',
                layers: {
                    main: { name: '璃月マップ', image: 'image/placeholder.png', bounds: [[0, 0], [1626, 2703]] }
                }
            }
        }
    },
    inazuma: {
        areas: {
            inazuma1: {
                name: '稲妻1',
                layers: {
                    main: { name: '稲妻1マップ', image: 'image/inazuma1.png', bounds: [[0, 0], [3190, 3000]] }
                }
            },
            inazuma2: {
                name: '稲妻2',
                layers: {
                    main: { name: '稲妻2マップ', image: 'image/inazuma2.png', bounds: [[0, 0], [2140, 3970]] }
                }
            },
            tenkumo: {
                name: '天雲峠',
                layers: {
                    main: { name: '天雲峠マップ', image: 'image/amakumo.png', bounds: [[0, 0], [1715, 2231]] }
                }
            },
            kaigishima: {
                name: '海祇島',
                layers: {
                    main: { name: '海祇島マップ', image: 'image/sangonomiya.png', bounds: [[0, 0], [1519, 2262]] }
                }
            },
            tsumei: {
                name: '鶴見',
                layers: {
                    main: { name: '鶴見マップ', image: 'image/turumi.png', bounds: [[0, 0], [1882, 1854]] },
                    underground1: { name: '鶴見地下1', image: 'image/turumichika.png', bounds: [[0, 0], [1069, 1720]] },
                    underground2: { name: '鶴見地下2', image: 'image/turumichika2.png', bounds: [[0, 0], [921, 1320]] }
                }
            },
            enkanomiya: {
                name: '淵下宮',
                layers: {
                    main: { name: '淵下宮マップ', image: 'image/enkanomiya.png', bounds: [[0, 0], [2094, 3065]] }
                }
            }
        }
    },
    sumeru: {
        areas: {
            sumeru: {
                name: 'スメール',
                layers: {
                    main: { name: 'スメールマップ', image: 'image/placeholder.png', bounds: [[0, 0], [1626, 2703]] }
                }
            }
        }
    },
    fontaine: {
        areas: {
            fontaine: {
                name: 'フォンテーヌ',
                layers: {
                    main: { name: 'フォンテーヌマップ', image: 'image/placeholder.png', bounds: [[0, 0], [1626, 2703]] }
                }
            }
        }
    },
    natlan: {
        areas: {
            natlan: {
                name: 'ナタ',
                layers: {
                    main: { name: 'ナタマップ', image: 'image/placeholder.png', bounds: [[0, 0], [1626, 2703]] }
                }
            }
        }
    }
};

// ピンのデータ管理
let points = JSON.parse(localStorage.getItem('genshinPoints')) || [];
let currentMapId = 'mondstadt_mondstadt_main';
let layerControl = null;
let currentLayers = {};

// ピンのアイコン定義
const icons = {
    '風神瞳': L.icon({ iconUrl: 'image/hujin.jpg', iconSize: [48, 48], iconAnchor: [24, 24] }),
    '岩神瞳': L.icon({ iconUrl: 'image/iwagami.jpg', iconSize: [48, 48], iconAnchor: [24, 24] }),
    '電神瞳': L.icon({ iconUrl: 'image/inazumahitomi.png', iconSize: [48, 48], iconAnchor: [24, 24] }),
    '草神瞳': L.icon({ iconUrl: 'image/sousin.png', iconSize: [48, 48], iconAnchor: [24, 24] }),
    '水神瞳': L.icon({ iconUrl: 'image/suijin.png', iconSize: [48, 48], iconAnchor: [24, 24] }),
    '炎神瞳': L.icon({ iconUrl: 'image/enjin.png', iconSize: [48, 48], iconAnchor: [24, 24] }),
    'チャレンジ': L.icon({ iconUrl: 'image/challenge.png', iconSize: [48, 48], iconAnchor: [24, 24] }),
    '仙霊': L.icon({ iconUrl: 'image/senrei.png', iconSize: [48, 48], iconAnchor: [24, 24] }),
    '立方体': L.icon({ iconUrl: 'image/square.png', iconSize: [48, 48], iconAnchor: [24, 24] }),
    '鍵紋1': L.icon({ iconUrl: 'image/key1.png', iconSize: [48, 48], iconAnchor: [24, 24] }),
    '鍵紋2': L.icon({ iconUrl: 'image/key2.png', iconSize: [48, 48], iconAnchor: [24, 24] }),
    '鍵紋3': L.icon({ iconUrl: 'image/key3.png', iconSize: [48, 48], iconAnchor: [24, 24] }),
    '普通の宝箱': L.icon({ iconUrl: 'image/hutu.png', iconSize: [48, 48], iconAnchor: [24, 24] }),
    '精巧な宝箱': L.icon({ iconUrl: 'image/seikou.png', iconSize: [48, 48], iconAnchor: [24, 24] }),
    '貴重な宝箱': L.icon({ iconUrl: 'image/kityou.png', iconSize: [48, 48], iconAnchor: [24, 24] }),
    '豪華な宝箱': L.icon({ iconUrl: 'image/gouka.png', iconSize: [48, 48], iconAnchor: [24, 24] })
};

// 宝箱の印ポイント
const chestPoints = {
    '普通の宝箱': 1,
    '精巧な宝箱': 2,
    '貴重な宝箱': 3,
    '豪華な宝箱': 4
};

// 有効なピンの種類
const validTypes = Object.keys(icons);

// ピンデータのエクスポート
window.exportPoints = function() {
    const data = JSON.stringify(points, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'genshin_points.json';
    a.click();
    URL.revokeObjectURL(url);
};

// ピンデータのインポート
window.importPoints = function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedPoints = JSON.parse(e.target.result);
            if (!Array.isArray(importedPoints)) throw new Error('Invalid JSON format');

            const validPoints = importedPoints.filter(point => {
                return (
                    point.id &&
                    point.mapId &&
                    validTypes.includes(point.type) &&
                    Array.isArray(point.coords) && point.coords.length === 2 &&
                    (point.description === undefined || typeof point.description === 'string') &&
                    (point.youtubeUrl === undefined || typeof point.youtubeUrl === 'string')
                );
            });

            if (validPoints.length === 0) {
                alert('有効なピンデータがありません');
                return;
            }

            points = validPoints;
            localStorage.setItem('genshinPoints', JSON.stringify(points));
            renderPoints();
            updateCounts();
            alert(`ピンデータをインポートしました（${validPoints.length}件）`);
        } catch (err) {
            alert('インポートに失敗しました: ' + err.message);
        }
    };
    reader.readAsText(file);
};

// ピンの数と印の累計を更新
function updateCounts() {
    const selectedTypes = Array.from(document.querySelectorAll('#drawer input[type="checkbox"]:checked')).map(cb => cb.value);
    const countsDiv = document.getElementById('counts');
    let html = '';

    Object.keys(maps).forEach(region => {
        Object.keys(maps[region].areas).forEach(area => {
            const areaName = maps[region].areas[area].name;
            const areaPoints = points.filter(p => p.mapId.startsWith(`${region}_${area}_`) && selectedTypes.includes(p.type));
            const typeCounts = {};
            selectedTypes.forEach(type => {
                typeCounts[type] = areaPoints.filter(p => p.type === type).length;
            });

            const chestTotal = points
                .filter(p => p.mapId.startsWith(`${region}_${area}_`) && Object.keys(chestPoints).includes(p.type))
                .reduce((sum, p) => sum + (chestPoints[p.type] || 0), 0);

            html += `<p><b>${areaName}</b>:</p>`;
            selectedTypes.forEach(type => {
                if (typeCounts[type] > 0) {
                    html += `<p>${type}: ${typeCounts[type]}</p>`;
                }
            });
            if (chestTotal > 0) {
                html += `<p>印: ${chestTotal}</p>`;
            }
        });
    });

    countsDiv.innerHTML = html || '<p>ピンなし</p>';
    renderPoints();
}

// マップを切り替え
function switchMap(region, area, layerId = 'main') {
    if (layerControl) layerControl.remove();
    Object.values(currentLayers).forEach(layer => map.removeLayer(layer));
    currentLayers = {};

    currentMapId = `${region}_${area}_${layerId}`;
    console.log(`Switching to map: ${currentMapId}`);

    const areaData = maps[region].areas[area];
    const imageBounds = areaData.layers[layerId].bounds;
    const layerGroup = {};
    Object.keys(areaData.layers).forEach(layerKey => {
        const layerData = areaData.layers[layerKey];
        console.log(`Loading layer: ${layerData.name}, image: ${layerData.image}`);
        currentLayers[layerKey] = L.imageOverlay(layerData.image, layerData.bounds);
        layerGroup[layerData.name] = currentLayers[layerKey];
    });

    currentLayers[layerId].addTo(map);
    map.fitBounds(imageBounds);
    map.setView([imageBounds[1][0] / 2, imageBounds[1][1] / 2], 0);

    layerControl = L.control.layers(layerGroup, null, { collapsed: false }).addTo(map);
    renderPoints();
    updateCounts();
}

// ピンをマップに描画
function renderPoints() {
    map.eachLayer(layer => {
        if (layer instanceof L.Marker) map.removeLayer(layer);
    });

    const selectedTypes = Array.from(document.querySelectorAll('#drawer input[type="checkbox"]:checked')).map(cb => cb.value);
    points.forEach(point => {
        if (point.mapId === currentMapId && selectedTypes.includes(point.type)) {
            const marker = L.marker(point.coords, { icon: icons[point.type], type: point.type, mapId: point.mapId }).addTo(map);
            const popupContent = `
                <b>${point.type}</b><br>${point.description || '（説明なし）'}
                <br><button class="edit" onclick="editPoint(${point.id})">編集</button>
                <button onclick="deletePoint(${point.id})">削除</button>
            `;
            marker.bindPopup(popupContent);
            if (point.youtubeUrl) {
                marker.on('click', () => openVideoModal(point.youtubeUrl));
            }
        }
    });
    console.log(`Rendered points for mapId: ${currentMapId}, count: ${points.filter(p => p.mapId === currentMapId).length}`);
}

// ドロワーの開閉
const toggleDrawer = document.getElementById('toggleDrawer');
const drawer = document.getElementById('drawer');
const closeDrawer = document.getElementById('closeDrawer');

toggleDrawer.addEventListener('click', () => {
    drawer.classList.toggle('open');
});

closeDrawer.addEventListener('click', () => {
    drawer.classList.remove('open');
});

// ドロワーの外をクリックで閉じる
window.addEventListener('click', (event) => {
    if (drawer.classList.contains('open') && !drawer.contains(event.target) && !toggleDrawer.contains(event.target)) {
        drawer.classList.remove('open');
    }
});

// ドロップダウンの初期化
const regionSelect = document.getElementById('regionSelect');
const areaSelect = document.getElementById('areaSelect');
const layerSelect = document.getElementById('layerSelect');
const layerLabel = document.getElementById('layerLabel');

function updateAreaSelect(region) {
    areaSelect.innerHTML = '';
    const areas = maps[region].areas;
    Object.keys(areas).forEach(areaKey => {
        const option = document.createElement('option');
        option.value = areaKey;
        option.textContent = areas[areaKey].name;
        areaSelect.appendChild(option);
    });
}

function updateLayerSelect(region, area) {
    if (region === 'inazuma' && area === 'tsumei') {
        layerSelect.innerHTML = '';
        const layers = maps[region].areas[area].layers;
        Object.keys(layers).forEach(layerKey => {
            const option = document.createElement('option');
            option.value = layerKey;
            option.textContent = layers[layerKey].name;
            layerSelect.appendChild(option);
        });
        layerLabel.style.display = 'inline';
        layerSelect.style.display = 'inline';
    } else {
        layerLabel.style.display = 'none';
        layerSelect.style.display = 'none';
    }
}

// 地域選択
regionSelect.addEventListener('change', () => {
    const region = regionSelect.value;
    updateAreaSelect(region);
    const area = areaSelect.value;
    updateLayerSelect(region, area);
    switchMap(region, area);
});

// エリア選択
areaSelect.addEventListener('change', () => {
    const region = regionSelect.value;
    const area = areaSelect.value;
    updateLayerSelect(region, area);
    const layerId = (region === 'inazuma' && area === 'tsumei') ? layerSelect.value : 'main';
    switchMap(region, area, layerId);
});

// レイヤー選択
layerSelect.addEventListener('change', () => {
    const region = regionSelect.value;
    const area = areaSelect.value;
    const layerId = layerSelect.value;
    switchMap(region, area, layerId);
});

// 初期マップ（モンド：モンド）
updateAreaSelect('mondstadt');
updateLayerSelect('mondstadt', 'mondstadt');
switchMap('mondstadt', 'mondstadt');

// ピンの削除
window.deletePoint = function(id) {
    points = points.filter(point => point.id !== id);
    localStorage.setItem('genshinPoints', JSON.stringify(points));
    renderPoints();
    updateCounts();
};

// ピンの編集
window.editPoint = function(id) {
    const point = points.find(p => p.id === id);
    if (!point) return;

    document.getElementById('pinModal').style.display = 'flex';
    document.getElementById('modalTitle').textContent = 'ピンを編集';
    document.querySelector(`input[name="type"][value="${point.type}"]`).checked = true;
    document.getElementById('description').value = point.description || '';
    document.getElementById('youtubeUrl').value = point.youtubeUrl ? point.youtubeUrl.replace('embed/', 'watch?v=') : '';
    tempCoords = point.coords;

    pinForm.onsubmit = function(e) {
        e.preventDefault();
        const youtubeUrl = document.getElementById('youtubeUrl').value;
        if (youtubeUrl && !youtubeUrl.match(/youtube\.com|youtu\.be/)) {
            alert('有効なYouTube URLを入力してください');
            return;
        }
        points = points.filter(p => p.id !== id);
        const updatedPoint = {
            id,
            mapId: currentMapId,
            type: document.querySelector('input[name="type"]:checked').value,
            coords: tempCoords,
            description: document.getElementById('description').value || '',
            youtubeUrl: youtubeUrl ? youtubeUrl.replace('watch?v=', 'embed/') : ''
        };
        points.push(updatedPoint);
        localStorage.setItem('genshinPoints', JSON.stringify(points));
        renderPoints();
        updateCounts();
        closePinModal();
        pinForm.onsubmit = addPointHandler;
    };
};

// ピンの追加
const addPointHandler = function(e) {
    e.preventDefault();
    const youtubeUrl = document.getElementById('youtubeUrl').value;
    if (youtubeUrl && !youtubeUrl.match(/youtube\.com|youtu\.be/)) {
        alert('有効なYouTube URLを入力してください');
        return;
    }
    const point = {
        id: Date.now(),
        mapId: currentMapId,
        type: document.querySelector('input[name="type"]:checked').value,
        coords: tempCoords,
        description: document.getElementById('description').value || '',
        youtubeUrl: youtubeUrl ? youtubeUrl.replace('watch?v=', 'embed/') : ''
    };
    points.push(point);
    localStorage.setItem('genshinPoints', JSON.stringify(points));
    renderPoints();
    updateCounts();
    closePinModal();
};

// フォームの初期ハンドラ
const pinForm = document.getElementById('pinForm');
pinForm.onsubmit = addPointHandler;

// マップクリックでピン追加モーダル
let tempCoords = null;
map.on('click', e => {
    tempCoords = [e.latlng.lat, e.latlng.lng];
    document.getElementById('pinModal').style.display = 'flex';
    document.getElementById('modalTitle').textContent = 'ピンを追加';
    pinForm.reset();
    document.querySelector('input[name="type"][value="風神瞳"]').checked = true;
    pinForm.onsubmit = addPointHandler;
});

// キャンセルボタン
const cancelButton = document.getElementById('cancelButton');
cancelButton.addEventListener('click', closePinModal);

// 動画モーダル
const videoModal = document.getElementById('videoModal');
const videoFrame = document.getElementById('videoFrame');
const videoClose = document.getElementsByClassName('video-close')[0];

function openVideoModal(url) {
    videoFrame.src = url;
    videoModal.style.display = 'flex';
}

videoClose.onclick = function() {
    videoModal.style.display = 'none';
    videoFrame.src = '';
};

// ピンモーダル
const pinModal = document.getElementById('pinModal');
const pinClose = document.getElementsByClassName('pin-close')[0];

function closePinModal() {
    pinModal.style.display = 'none';
    pinForm.reset();
    tempCoords = null;
    pinForm.onsubmit = addPointHandler;
}

pinClose.onclick = closePinModal;

// モーダルの外をクリックで閉じる
window.onclick = function(event) {
    if (event.target == videoModal) {
        videoModal.style.display = 'none';
        videoFrame.src = '';
    }
    if (event.target == pinModal) {
        closePinModal();
    }
};