// マップの初期化
const map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: -5,
    maxZoom: 5,
    renderer: L.canvas()
});

// ← この直後に追加
map.on('click', function(e) {
  console.log('クリック位置:', e.latlng);
});

// マップ定義
const maps = {
    mondstadt: {
        areas: {
            mondstadt: {
                name: 'モンド',
                layers: {
                    main: {
                        name: 'モンドマップ',
                        image: 'image/mondstadt.png',
                        bounds: [[0, 0], [2765, 3878]]
                    }
                }
            }
        }
    },
    liyue: {
        areas: {
            liyue: {
                name: '璃月',
                layers: {
                    main: {
                        name: '璃月マップ',
                        image: 'image/liyue.png',
                        bounds: [[0, 0], [4169, 4571]]
                    }
                }
            },
            chasm: {
                name: '層岩巨淵',
                layers: {
                    main: {
                        name: '層岩巨淵マップ',
                        image: 'image/natlan_P0.png',
                        bounds: [[0, 0], [1677, 1893]]
                    }
                }
            }
        }
    },
    inazuma: {
        areas: {
            inazuma1: {
                name: '稲妻',
                layers: {
                    main: {
                        name: '稲妻マップ',
                        image: 'image/inazuma1_P0.png',
                        bounds: [[0, 0], [5568, 6018]]
                    }
                }
            },
            enkanomiya: {
                name: '淵下宮',
                layers: {
                    main: {
                        name: '淵下宮マップ',
                        image: 'image/inazuma_P0.png',
                        bounds: [[0, 0], [3018, 3171]]
                    }
                }
            }
        }
    },
    sumeru: {
        areas: {
            sumeru: {
                name: 'スメール',
                layers: {
                    main: {
                        name: 'スメールマップ',
                        image: 'image/sumeru_P0_highres.png',
                        bounds: [[0, 0], [5578, 5543]]
                    }
                }
            }
        }
    },
    fontaine: {
        areas: {
            fontaine: {
                name: 'フォンテーヌ',
                layers: {
                    main: {
                        name: 'フォンテーヌマップ',
                        image: 'image/fontaine_map.png',
                        bounds: [[0, 0], [4356, 3175]]
                    }
                }
            },
            seaofpast: {
                name: '往日の海',
                layers: {
                    main: {
                        name: '往日の海マップ',
                        image: 'image/map34_P0.png',
                        bounds: [[0, 0], [1014, 1998]]
                    }
                }
            }
        }
    },
    natlan: {
        areas: {
            natlan: {
                name: 'ナタ',
                layers: {
                    main: {
                        name: 'ナタマップ',
                        image: 'image/natlan_N1.png',
                        bounds: [[0, 0], [5896, 5432]]
                    }
                }
            },
            holy_mountain: {
                name: '古の聖山',
                layers: {
                    main: {
                        name: '古の聖山マップ',
                        image: 'image/map36_P0.png',
                        bounds: [[0, 0], [3117, 2634]]
                    }
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
const baseIcons = {
    '風神瞳': { url: 'image/hujin.jpg', size: [48, 48], anchor: [24, 24] },
    '岩神瞳': { url: 'image/iwagami.jpg', size: [48, 48], anchor: [24, 24] },
    '電神瞳': { url: 'image/inazumahitomi.png', size: [48, 48], anchor: [24, 24] },
    '草神瞳': { url: 'image/sousin.png', size: [48, 48], anchor: [24, 24] },
    '水神瞳': { url: 'image/suijin.png', size: [48, 48], anchor: [24, 24] },
    '炎神瞳': { url: 'image/enjin.png', size: [48, 48], anchor: [24, 24] },
    'チャレンジ': { url: 'image/challenge.png', size: [48, 48], anchor: [24, 24] },
    '仙霊': { url: 'image/senrei.png', size: [48, 48], anchor: [24, 24] },
    '立方体': { url: 'image/square.png', size: [48, 48], anchor: [24, 24] },
    '鍵紋1': { url: 'image/key1.png', size: [48, 48], anchor: [24, 24] },
    '鍵紋2': { url: 'image/key2.png', size: [48, 48], anchor: [24, 24] },
    '鍵紋3': { url: 'image/key3.png', size: [48, 48], anchor: [24, 24] },
    '鍵紋4': { url: 'image/key4.png', size: [48, 48], anchor: [24, 24] },
    '鍵紋5': { url: 'image/key5.png', size: [48, 48], anchor: [24, 24] },
    '雷霊': { url: 'image/rairei.png', size: [48, 48], anchor: [24, 24] },

    'アランナラ': { url: 'image/arannara.png', size: [48, 48], anchor: [24, 24] },
    'スメールギミック': { url: 'image/SGimmick.png', size: [48, 48], anchor: [24, 24] },
    '元素石碑': { url: 'image/sekihi.png', size: [48, 48], anchor: [24, 24] },
    '短火装置': { url: 'image/dai.png', size: [48, 48], anchor: [24, 24] },
    '死域': { url: 'image/shiki.png', size: [48, 48], anchor: [24, 24] },
    'リーフコア': { url: 'image/leaf.png', size: [48, 48], anchor: [24, 24] },

    '普通の宝箱': { url: 'image/hutu.png', size: [48, 48], anchor: [24, 24] },
    '精巧な宝箱': { url: 'image/seikou.png', size: [48, 48], anchor: [24, 24] },
    '貴重な宝箱': { url: 'image/kityou.png', size: [48, 48], anchor: [24, 24] },
    '豪華な宝箱': { url: 'image/gouka.png', size: [48, 48], anchor: [24, 24] },
    '珍奇な宝箱': { url: 'image/tinki.png', size: [48, 48], anchor: [24, 24] }
};

// 動的アイコン生成
function getIcon(type, zoom, flags = {}) {
    const base = baseIcons[type];
    const scale = 1 + (zoom / 10);
    const size = [
        Math.max(16, Math.min(96, base.size[0] * scale)),
        Math.max(16, Math.min(96, base.size[1] * scale))
    ];
    const anchor = [
        Math.max(8, Math.min(48, base.anchor[0] * scale)),
        Math.max(8, Math.min(48, base.anchor[1] * scale))
    ];
    const classes = [
        'marker-container',
        flags.isUnderground ? 'underground-marker' : '',
        flags.isSeirei ? 'seirei-marker' : '',
        flags.isChallenge ? 'challenge-marker' : ''
    ].filter(Boolean).join(' ');
    return L.divIcon({
        className: classes,
        html: `
            <div style="--scale: ${scale}">
                <img src="${base.url}" style="width: ${size[0]}px; height: ${size[1]}px;">
            </div>
        `,
        iconSize: size,
        iconAnchor: anchor
    });
}

// 宝箱の印ポイント
const chestPoints = {
    '普通の宝箱': 1,
    '精巧な宝箱': 2,
    '貴重な宝箱': 3,
    '豪華な宝箱': 4,
    '珍奇な宝箱': 5
};

// 有効なピンの種類
const validTypes = Object.keys(baseIcons);

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
                    (point.youtubeUrl === undefined || typeof point.youtubeUrl === 'string') &&
                    (point.isUnderground === undefined || typeof point.isUnderground === 'boolean') &&
                    (point.isSeirei === undefined || typeof point.isSeirei === 'boolean') &&
                    (point.isChallenge === undefined || typeof point.isChallenge === 'boolean')
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
                const pointsOfType = areaPoints.filter(p => p.type === type);
                const categories = [];
                pointsOfType.forEach(p => {
                    const flags = [];
                    if (p.isUnderground) flags.push('地下');
                    if (p.isSeirei) flags.push('仙');
                    if (p.isChallenge) flags.push('チャレンジ');
                    const key = flags.length ? flags.join(', ') : '地上';
                    typeCounts[`${type}_${key}`] = (typeCounts[`${type}_${key}`] || 0) + 1;
                });
            });

            const chestTotal = points
                .filter(p => p.mapId.startsWith(`${region}_${area}_`) && Object.keys(chestPoints).includes(p.type))
                .reduce((sum, p) => sum + (chestPoints[p.type] || 0), 0);

            html += `<p><b>${areaName}</b>:</p>`;
            Object.keys(typeCounts).forEach(key => {
                const [type, category] = key.split('_');
                html += `<p>${type} (${category}): ${typeCounts[key]}</p>`;
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
        const layer = L.imageOverlay(layerData.image, layerData.bounds);
        layer.on('error', () => {
            console.error(`Failed to load image: ${layerData.image}`);
            alert(`マップ画像の読み込みに失敗しました: ${layerData.name}`);
        });
        currentLayers[layerKey] = layer;
        layerGroup[layerData.name] = layer;
    });

    try {
        currentLayers[layerId].addTo(map);
        map.fitBounds(imageBounds);
        map.setView([imageBounds[1][0] / 2, imageBounds[1][1] / 2], 0);
        layerControl = L.control.layers(layerGroup, null, { collapsed: false }).addTo(map);
        renderPoints();
        updateCounts();
    } catch (err) {
        console.error('Error in switchMap:', err);
        alert('マップの切り替えに失敗しました');
    }
}

// ピンをマップに描画
function renderPoints() {
    map.eachLayer(layer => {
        if (layer instanceof L.Marker) map.removeLayer(layer);
    });

    const zoom = map.getZoom();
    const selectedTypes = Array.from(document.querySelectorAll('#drawer input[type="checkbox"]:checked')).map(cb => cb.value);
    points.forEach(point => {
        if (point.mapId === currentMapId && selectedTypes.includes(point.type)) {
            try {
                const marker = L.marker(point.coords, {
                    icon: getIcon(point.type, zoom, {
                        isUnderground: point.isUnderground,
                        isSeirei: point.isSeirei,
                        isChallenge: point.isChallenge
                    }),
                    type: point.type,
                    mapId: point.mapId
                }).addTo(map);
                const flags = [];
                if (point.isUnderground) flags.push('地下');
                if (point.isSeirei) flags.push('仙');
                if (point.isChallenge) flags.push('チャレンジ');
                const flagText = flags.length ? ` (${flags.join(', ')})` : '';
                const popupContent = `
                    <b>${point.type}${flagText}</b><br>
                    ${point.description || '（説明なし）'}
                    <br><button class="edit" onclick="editPoint(${point.id})">編集</button>
                    <button onclick="deletePoint(${point.id})">削除</button>
                `;
                marker.bindPopup(popupContent);
                if (point.youtubeUrl) {
                    marker.on('click touchend', () => openVideoModal(point.youtubeUrl));
                }
            } catch (err) {
                console.error(`Error rendering point ${point.id}:`, err);
            }
        }
    });
    console.log(`Rendered points for mapId: ${currentMapId}, count: ${points.filter(p => p.mapId === currentMapId).length}`);
}

// ズーム時にピンのサイズを更新
map.on('zoomend', () => {
    renderPoints();
});

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

regionSelect.addEventListener('change', () => {
    const region = regionSelect.value;
    updateAreaSelect(region);
    const area = areaSelect.value;
    updateLayerSelect(region, area);
    switchMap(region, area);
});

areaSelect.addEventListener('change', () => {
    const region = regionSelect.value;
    const area = areaSelect.value;
    updateLayerSelect(region, area);
    const layerId = (region === 'inazuma' && area === 'tsumei') ? layerSelect.value : 'main';
    switchMap(region, area, layerId);
});

layerSelect.addEventListener('change', () => {
    const region = regionSelect.value;
    const area = areaSelect.value;
    const layerId = layerSelect.value;
    switchMap(region, area, layerId);
});

try {
    updateAreaSelect('mondstadt');
    updateLayerSelect('mondstadt', 'mondstadt');
    switchMap('mondstadt', 'mondstadt');
} catch (err) {
    console.error('Error initializing map:', err);
    alert('マップの初期化に失敗しました');
}

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

    const pinModal = document.getElementById('pinModal');
    setTimeout(() => {
        pinModal.style.display = 'flex';
    }, 100);
    document.getElementById('modalTitle').textContent = 'ピンを編集';
    document.querySelector(`input[name="type"][value="${point.type}"]`).checked = true;
    document.getElementById('isUnderground').checked = point.isUnderground || false;
    document.getElementById('isSeirei').checked = point.isSeirei || false;
    document.getElementById('isChallenge').checked = point.isChallenge || false;
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
            isUnderground: document.getElementById('isUnderground').checked,
            isSeirei: document.getElementById('isSeirei').checked,
            isChallenge: document.getElementById('isChallenge').checked,
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
        isUnderground: document.getElementById('isUnderground').checked,
        isSeirei: document.getElementById('isSeirei').checked,
        isChallenge: document.getElementById('isChallenge').checked,
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

// マップクリック/タッチでピン追加モーダル
let tempCoords = null;
map.on('click touchend', e => {
    tempCoords = [e.latlng.lat, e.latlng.lng];
    const pinModal = document.getElementById('pinModal');
    console.log('Opening pin modal at coords:', tempCoords);
    setTimeout(() => {
        pinModal.style.display = 'flex';
    }, 100);
    document.getElementById('modalTitle').textContent = 'ピンを追加';
    pinForm.reset();
    document.querySelector('input[name="type"][value="風神瞳"]').checked = true;
    document.getElementById('isUnderground').checked = false;
    document.getElementById('isSeirei').checked = false;
    document.getElementById('isChallenge').checked = false;
    pinForm.onsubmit = addPointHandler;
});

// キャンセルボタン
const cancelButton = document.getElementById('cancelButton');
cancelButton.addEventListener('click', closePinModal);
cancelButton.addEventListener('touchend', closePinModal);

// 動画モーダル
const videoModal = document.getElementById('videoModal');
const videoFrame = document.getElementById('videoFrame');
const videoClose = document.getElementsByClassName('video-close')[0];

function openVideoModal(url) {
    videoFrame.src = url;
    setTimeout(() => {
        videoModal.style.display = 'flex';
    }, 100);
}

videoClose.onclick = function() {
    videoModal.style.display = 'none';
    videoFrame.src = '';
};
videoClose.addEventListener('touchend', () => {
    videoModal.style.display = 'none';
    videoFrame.src = '';
});

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
pinClose.addEventListener('touchend', closePinModal);

window.onclick = function(event) {
    if (event.target == videoModal) {
        videoModal.style.display = 'none';
        videoFrame.src = '';
    }
    if (event.target == pinModal) {
        closePinModal();
    }
};
window.addEventListener('touchend', (event) => {
    if (event.target == videoModal) {
        videoModal.style.display = 'none';
        videoFrame.src = '';
    }
    if (event.target == pinModal) {
        closePinModal();
    }
});
