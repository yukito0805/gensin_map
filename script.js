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
let points = [];
const MAX_POINTS = 100;
const markers = new Map();

// ピンデータの読み書き
function loadPoints(region, area, layer) {
    points = JSON.parse(localStorage.getItem(`genshinPoints_${region}_${area}_${layer}`)) || [];
    console.log(`Loaded points for ${region}_${area}_${layer}:`, points);
    renderPoints();
}
function savePoints(region, area, layer) {
    if (points.length > MAX_POINTS) points = points.slice(-MAX_POINTS);
    localStorage.setItem(`genshinPoints_${region}_${area}_${layer}`, JSON.stringify(points));
}

// ピンのアイコン定義
const icons = {
    '風神瞳': L.icon({ iconUrl: 'image/hujin.jpg', iconSize: [48, 48], iconAnchor: [24, 24], popupAnchor: [0, -24] }),
    '岩神瞳': L.icon({ iconUrl: 'image/iwagami.jpg', iconSize: [48, 48], iconAnchor: [24, 24], popupAnchor: [0, -24] }),
    '電神瞳': L.icon({ iconUrl: 'image/inazumahitomi.png', iconSize: [48, 48], iconAnchor: [24, 24], popupAnchor: [0, -24] }),
    '草神瞳': L.icon({ iconUrl: 'image/sousin.png', iconSize: [48, 48], iconAnchor: [24, 24], popupAnchor: [0, -24] }),
    '水神瞳': L.icon({ iconUrl: 'image/suijin.png', iconSize: [48, 48], iconAnchor: [24, 24], popupAnchor: [0, -24] }),
    '炎神瞳': L.icon({ iconUrl: 'image/enjin.png', iconSize: [48, 48], iconAnchor: [24, 24], popupAnchor: [0, -24] }),
    'チャレンジ': L.icon({ iconUrl: 'image/challenge.png', iconSize: [48, 48], iconAnchor: [24, 24], popupAnchor: [0, -24] }),
    '仙霊': L.icon({ iconUrl: 'image/senrei.png', iconSize: [48, 48], iconAnchor: [24, 24], popupAnchor: [0, -24] }),
    '立方体': L.icon({ iconUrl: 'image/square.png', iconSize: [48, 48], iconAnchor: [24, 24], popupAnchor: [0, -24] }),
    '鍵紋1': L.icon({ iconUrl: 'image/key1.png', iconSize: [48, 48], iconAnchor: [24, 24], popupAnchor: [0, -24] }),
    '鍵紋2': L.icon({ iconUrl: 'image/key2.png', iconSize: [48, 48], iconAnchor: [24, 24], popupAnchor: [0, -24] }),
    '鍵紋3': L.icon({ iconUrl: 'image/key3.png', iconSize: [48, 48], iconAnchor: [24, 24], popupAnchor: [0, -24] })
};

// 座標の正規化
function normalizeCoords(coords, bounds) {
    const [[minY, minX], [maxY, maxX]] = bounds;
    const [y, x] = coords;
    return [
        Math.max(minY, Math.min(maxY, y)),
        Math.max(minX, Math.min(maxX, x))
    ];
}

// ピンをマップに描画
async function renderPoints() {
    console.log('Rendering points:', points);
    markers.forEach((marker, id) => {
        if (!points.find(p => p.id === id)) {
            map.removeLayer(marker);
            markers.delete(id);
        }
    });
    const region = document.getElementById('regionSelect').value;
    const area = document.getElementById('areaSelect').value;
    const layer = document.getElementById('layerSelect').value || 'main';
    const bounds = maps[region].areas[area].layers[layer].bounds;
    points.forEach(point => {
        if (!markers.has(point.id)) {
            try {
                const normalizedCoords = normalizeCoords(point.coords, bounds);
                const marker = L.marker(normalizedCoords, { icon: icons[point.type], type: point.type }).addTo(map);
                const popupContent = `
                    <b>${point.type}</b><br>${point.description || '（説明なし）'}
                    <br><button class="edit" onclick="editPoint(${point.id})">編集</button>
                    <button onclick="deletePoint(${point.id})">削除</button>
                `;
                marker.bindPopup(popupContent);
                if (point.youtubeUrl) {
                    marker.on('click', () => openVideoModal(point.youtubeUrl));
                }
                markers.set(point.id, marker);
            } catch (e) {
                console.error('Error rendering point:', point, e);
            }
        }
    });
}

// ピンの削除
window.deletePoint = async function(id) {
    points = points.filter(point => point.id !== id);
    const region = document.getElementById('regionSelect').value;
    const area = document.getElementById('areaSelect').value;
    const layer = document.getElementById('layerSelect').value || 'main';
    savePoints(region, area, layer);
    await renderPoints();
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
    map.once('click', e => {
        tempCoords = [e.latlng.lat, e.latlng.lng];
    });
    pinForm.onsubmit = async function(e) {
        e.preventDefault();
        const youtubeUrl = document.getElementById('youtubeUrl').value;
        if (youtubeUrl && !youtubeUrl.match(/youtube\.com|youtu\.be/)) {
            alert('有効なYouTube URLを入力してください');
            return;
        }
        const region = document.getElementById('regionSelect').value;
        const area = document.getElementById('areaSelect').value;
        const layer = document.getElementById('layerSelect').value || 'main';
        const bounds = maps[region].areas[area].layers[layer].bounds;
        points = points.filter(p => p.id !== id);
        const updatedPoint = {
            id,
            type: document.querySelector('input[name="type"]:checked').value,
            coords: normalizeCoords(tempCoords, bounds),
            description: document.getElementById('description').value || '',
            youtubeUrl: youtubeUrl ? youtubeUrl.replace('watch?v=', 'embed/') : ''
        };
        points.push(updatedPoint);
        savePoints(region, area, layer);
        await renderPoints();
        closePinModal();
        pinForm.onsubmit = addPointHandler;
    };
};

// ピンの追加
const addPointHandler = async function(e) {
    e.preventDefault();
    const youtubeUrl = document.getElementById('youtubeUrl').value;
    if (youtubeUrl && !youtubeUrl.match(/youtube\.com|youtu\.be/)) {
        alert('有効なYouTube URLを入力してください');
        return;
    }
    const region = document.getElementById('regionSelect').value;
    const area = document.getElementById('areaSelect').value;
    const layer = document.getElementById('layerSelect').value || 'main';
    const bounds = maps[region].areas[area].layers[layer].bounds;
    const point = {
        id: Date.now(),
        type: document.querySelector('input[name="type"]:checked').value,
        coords: normalizeCoords(tempCoords, bounds),
        description: document.getElementById('description').value || '',
        youtubeUrl: youtubeUrl ? youtubeUrl.replace('watch?v=', 'embed/') : ''
    };
    points.push(point);
    savePoints(region, area, layer);
    await renderPoints();
    closePinModal();
};

// フォームの初期ハンドラを設定
const pinForm = document.getElementById('pinForm');
pinForm.onsubmit = addPointHandler;

// マップクリックでピン追加モーダルを表示
let tempCoords = null;
map.on('click', e => {
    tempCoords = [e.latlng.lat, e.latlng.lng];
    document.getElementById('pinModal').style.display = 'flex';
    document.getElementById('modalTitle').textContent = 'ピンを追加';
    pinForm.reset();
    document.querySelector('input[name="type"][value="風神瞳"]').checked = true;
    pinForm.onsubmit = addPointHandler;
});

// キャンセルボタンの処理
const cancelButton = document.getElementById('cancelButton');
cancelButton.addEventListener('click', closePinModal);

// 動画モーダルの処理
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

// ピンモーダルの処理
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

// マップの初期化（動的）
let currentOverlay = null;
function initializeMap(region, area, layer) {
    try {
        const mapData = maps[region].areas[area].layers[layer];
        if (currentOverlay) {
            map.removeLayer(currentOverlay);
        }
        currentOverlay = L.imageOverlay(mapData.image, mapData.bounds).addTo(map);
        map.fitBounds(mapData.bounds);
        loadPoints(region, area, layer);
    } catch (e) {
        console.error('Error in initializeMap:', e);
        if (currentOverlay) {
            map.removeLayer(currentOverlay);
        }
        currentOverlay = L.imageOverlay('image/mondstadt.png', [[0, 0], [2765, 3878]]).addTo(map);
        map.fitBounds([[0, 0], [2765, 3878]]);
        loadPoints('mondstadt', 'mondstadt', 'main');
    }
}

// エリアとレイヤーの更新
function updateRegionSelect() {
    const regionSelect = document.getElementById('regionSelect');
    regionSelect.innerHTML = '';
    const regions = {
        mondstadt: 'モンド',
        liyue: '璃月',
        inazuma: '稲妻',
        sumeru: 'スメール',
        fontaine: 'フォンテーヌ',
        natlan: 'ナタ'
    };
    Object.keys(regions).forEach(regionKey => {
        const option = document.createElement('option');
        option.value = regionKey;
        option.textContent = regions[regionKey];
        regionSelect.appendChild(option);
    });
}
function updateAreaSelect() {
    const region = document.getElementById('regionSelect').value;
    const areaSelect = document.getElementById('areaSelect');
    areaSelect.innerHTML = '';
    Object.keys(maps[region].areas).forEach(areaKey => {
        const option = document.createElement('option');
        option.value = areaKey;
        option.textContent = maps[region].areas[areaKey].name;
        areaSelect.appendChild(option);
    });
    updateLayerSelect();
}
function updateLayerSelect() {
    const region = document.getElementById('regionSelect').value;
    const area = document.getElementById('areaSelect').value;
    const layerSelect = document.getElementById('layerSelect');
    const layerLabel = document.getElementById('layerLabel');
    layerSelect.innerHTML = '';
    try {
        const layers = maps[region].areas[area].layers;
        if (Object.keys(layers).length > 1) {
            layerLabel.style.display = 'inline';
            layerSelect.style.display = 'inline';
            Object.keys(layers).forEach(layerKey => {
                const option = document.createElement('option');
                option.value = layerKey;
                option.textContent = layers[layerKey].name;
                layerSelect.appendChild(option);
            });
        } else {
            layerLabel.style.display = 'none';
            layerSelect.style.display = 'none';
        }
    } catch (e) {
        console.error('Error in updateLayerSelect:', e);
        layerLabel.style.display = 'none';
        layerSelect.style.display = 'none';
    }
}

// イベントリスナー
document.getElementById('regionSelect').addEventListener('change', () => {
    updateAreaSelect();
    const region = document.getElementById('regionSelect').value;
    const area = document.getElementById('areaSelect').value;
    const layer = document.getElementById('layerSelect').value || 'main';
    initializeMap(region, area, layer);
});
document.getElementById('areaSelect').addEventListener('change', () => {
    updateLayerSelect();
    const region = document.getElementById('regionSelect').value;
    const area = document.getElementById('areaSelect').value;
    const layer = document.getElementById('layerSelect').value || 'main';
    initializeMap(region, area, layer);
});
document.getElementById('layerSelect').addEventListener('change', () => {
    const region = document.getElementById('regionSelect').value;
    const area = document.getElementById('areaSelect').value;
    const layer = document.getElementById('layerSelect').value;
    initializeMap(region, area, layer);
});

// 初期化
updateRegionSelect();
updateAreaSelect();
initializeMap('mondstadt', 'mondstadt', 'main');
