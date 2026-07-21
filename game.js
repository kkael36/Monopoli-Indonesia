// =========================================
// 1. SAFE AUDIO HANDLER
// =========================================
const sfx = {
    dice: 'audio/dice.mp3',
    step: 'audio/step.mp3',
    buy: 'audio/buy.mp3',
    pay: 'audio/pay.mp3',
    card: 'audio/card.mp3',
    jail: 'audio/jail.mp3'
};

function playSound(audioFile) {
    try {
        const audio = new Audio(audioFile);
        audio.play().catch(err => console.warn(`[Safe Audio] Gagal play ${audioFile}.`));
    } catch(e) { console.warn(`[Safe Audio] Exception:`, e); }
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// =========================================
// 2. DATA KARTU SARKAS (Masing-masing 16 Kartu)
// =========================================
const netizenCards = [
    { text: "Pusat Data Nasional Kena Ransomware: Bayar perbaikan Rp 50.000", value: -50000, type: "money" },
    { text: "Kena Tilang Manual Lupa Helm: Bayar damai Rp 20.000", value: -20000, type: "money" },
    { text: "Investasi Bodong: Nangis rugi Rp 100.000", value: -100000, type: "money" },
    { text: "War Tiket Konser K-Pop: Cuan calo Rp 150.000", value: 150000, type: "money" },
    { text: "Jalanan Berlubang Bikin Ban Bocor: Tambal ban Rp 30.000", value: -30000, type: "money" },
    { text: "Kena Palak Pemuda Pancasila: Ngasih duit Rp 40.000", value: -40000, type: "money" },
    { text: "Nonton Live Stream Jualan Kalap Belanja: Paylater jebol Rp 70.000", value: -70000, type: "money" },
    { text: "Ketemu Lubang Misterius di Lampung: Press velg Rp 50.000", value: -50000, type: "money" },
    { text: "Kuota Internet Habis: Hilang sinyal, SKIP 1 Giliran!", value: 0, type: "skip" },
    { text: "Kena Jebak Arisan Bodong: Saldo melayang Rp 90.000", value: -90000, type: "money" },
    { text: "Parkir Liar Minimarket Ditagih Ormas: Melayang Rp 10.000", value: -10000, type: "money" },
    { text: "Spill Rahasia di X (Twitter) Viral: Dapet donasi netizen Rp 80.000", value: 80000, type: "money" },
    { text: "Kena Frame Kamera Konten Prank: Malu berat, rugi Rp 40.000", value: -40000, type: "money" },
    { text: "Motor Ditarik Leasing Karena Nunggak: Bayar denda Rp 60.000", value: -60000, type: "money" },
    { text: "Kena Pinjol Ilegal Bunga Dicekik: Bayar tagihan Rp 80.000", value: -80000, type: "money" },
    { text: "Ketipu Olshop COD Barang Zonk: Rungkad Rp 50.000", value: -50000, type: "money" }
];

const orangDalamCards = [
    { text: "Punya Bekingan Pejabat: Bebas Sel VVIP (Simpan Kartu)", value: 0, type: "bebas_sel" },
    { text: "Menang Proyek Jalur Belakang: Cair dana Rp 200.000", value: 200000, type: "money" },
    { text: "Jalur Prestasi Akrab Sama Panitia: Maju 3 Langkah instan", value: 3, type: "move" },
    { text: "Cair Dana Bansos Tambahan: Masuk rekening Rp 100.000", value: 100000, type: "money" },
    { text: "Kenal Sama Kepala Dinas Terkait: Bebas Sel VVIP (Simpan Kartu)", value: 0, type: "bebas_sel" },
    { text: "Dapet Warisan Tanah Nenek Moyang: Tunai keraaass Rp 150.000", value: 150000, type: "money" },
    { text: "Lolos Seleksi CPNS Jalur Langit: Gaji pertama Rp 120.000", value: 120000, type: "money" },
    { text: "Numpang Wi-Fi Gratisan Kantor Pemerintah: Hemat kuota Rp 30.000", value: 30000, type: "money" },
    { text: "Nego Denda Pajak Lewat Orang Dalam: BEBAS PAJAK putaran ini!", value: 0, type: "bebas_pajak" },
    { text: "Kena Serangan Fajar: Cuan Rp 100.000", value: 100000, type: "money" },
    { text: "Titip Orang Dalam di BUMN: Tunjangan bonus cair Rp 180.000", value: 180000, type: "money" },
    { text: "Disposisi Kilat Bapak Pejabat: Maju 2 Langkah instan", value: 2, type: "move" },
    { text: "Dapet Jatah Kavling Strategis: Bonus uang tunai Rp 130.000", value: 130000, type: "money" },
    { text: "Lolos Razia Gabungan Pakai Stiker Anggota: Bebas Denda Rp 50.000", value: 50000, type: "money" },
    { text: "Info Awal Pembebasan Lahan: Cuan spekulasi tanah Rp 250.000", value: 250000, type: "money" },
    { text: "Nge-sponsorship Event Pakai APBD: Masuk kantong Rp 110.000", value: 110000, type: "money" }
];

// =========================================
// 3. DATA PAPAN 40 PETAK
// =========================================
const boardSpaces = [
    { id: 0, name: "START\n(Cair Bansos +Rp 200k)", type: "start", price: 0, rent: 0, grid: "11/11/12/12", corner: true, icon: "💵" },
    { id: 1, name: "Tugu Kujang\nBogor", type: "property", price: 60000, rent: 10000, color: "#8B4513", grid: "11/10/12/11", icon: "🏛️" },
    { id: 2, name: "Nasib Netizen", type: "card_netizen", price: 0, rent: 0, grid: "11/9/12/10" },
    { id: 3, name: "Alun-Alun\nBekasi", type: "property", price: 80000, rent: 15000, color: "#8B4513", grid: "11/8/12/9", icon: "🏙️" },
    { id: 4, name: "Pajak Tapera", type: "tax", price: 100000, rent: 0, grid: "11/7/12/8", icon: "💸" },
    { id: 5, name: "Stasiun KRL\nManggarai", type: "property", price: 200000, rent: 40000, color: "#666", grid: "11/6/12/7", icon: "🚉" },
    { id: 6, name: "Margonda\nDepok", type: "property", price: 100000, rent: 20000, color: "#87CEEB", grid: "11/5/12/6", icon: "🛣️" },
    { id: 7, name: "Orang Dalam", type: "card_dalam", price: 0, rent: 0, grid: "11/4/12/5" },
    { id: 8, name: "Suryakencana\nBogor", type: "property", price: 120000, rent: 25000, color: "#87CEEB", grid: "11/3/12/4", icon: "🍜" },
    { id: 9, name: "Puncak Pass\nBogor", type: "property", price: 120000, rent: 25000, color: "#87CEEB", grid: "11/2/12/3", icon: "🏔️" },
    { id: 10, name: "Sel VVIP", type: "jail", price: 0, rent: 0, grid: "11/1/12/2", corner: true, icon: "🚔" },
    
    { id: 11, name: "Jalan Riau\nBandung", type: "property", price: 140000, rent: 30000, color: "#FF69B4", grid: "10/1/11/2", icon: "🛍️" },
    { id: 12, name: "Perumda Air\nPDAM", type: "property", price: 150000, rent: 30000, color: "#2E8B57", grid: "9/1/10/2", icon: "💧" },
    { id: 13, name: "Gedung Sate\nBandung", type: "property", price: 140000, rent: 30000, color: "#FF69B4", grid: "8/1/9/2", icon: "🏛️" },
    { id: 14, name: "Kebun Raya\nBogor", type: "property", price: 160000, rent: 35000, color: "#FF69B4", grid: "7/1/8/2", icon: "🌳" },
    { id: 15, name: "Terminal\nBaranangsiang", type: "property", price: 200000, rent: 40000, color: "#666", grid: "6/1/7/2", icon: "🚌" },
    { id: 16, name: "Pantai Kuta\nBali", type: "property", price: 180000, rent: 40000, color: "#FFA500", grid: "5/1/6/2", icon: "🏖️" },
    { id: 17, name: "Nasib Netizen", type: "card_netizen", price: 0, rent: 0, grid: "4/1/5/2" },
    { id: 18, name: "Tanah Lot\nBali", type: "property", price: 180000, rent: 40000, color: "#FFA500", grid: "3/1/4/2", icon: "🌅" },
    { id: 19, name: "Seminyak\nBali", type: "property", price: 200000, rent: 45000, color: "#FFA500", grid: "2/1/3/2", icon: "🍸" },
    { id: 20, name: "Rest Area\nTol", type: "free", price: 0, rent: 0, grid: "1/1/2/2", corner: true, icon: "🅿️" },
    
    { id: 21, name: "Jalan Malioboro\nJogja", type: "property", price: 220000, rent: 50000, color: "#D62828", grid: "1/2/2/3", icon: "🎨" },
    { id: 22, name: "Orang Dalam", type: "card_dalam", price: 0, rent: 0, grid: "1/3/2/4" },
    { id: 23, name: "Sentul City\nBogor", type: "property", price: 220000, rent: 50000, color: "#D62828", grid: "1/4/2/5", icon: "🏎️" },
    { id: 24, name: "Senopati\nJakarta", type: "property", price: 240000, rent: 55000, color: "#D62828", grid: "1/5/2/6", icon: "☕" },
    { id: 25, name: "Bandara\nSoekarno-Hatta", type: "property", price: 200000, rent: 40000, color: "#666", grid: "1/6/2/7", icon: "✈️" },
    { id: 26, name: "Menteng\nJakarta", type: "property", price: 260000, rent: 60000, color: "#F4D03F", grid: "1/7/2/8", icon: "🏡" },
    { id: 27, name: "Kemang\nJakarta", type: "property", price: 260000, rent: 60000, color: "#F4D03F", grid: "1/8/2/9", icon: "🏢" },
    { id: 28, name: "PT PLN\nPersero", type: "property", price: 150000, rent: 30000, color: "#2E8B57", grid: "1/9/2/10", icon: "⚡" },
    { id: 29, name: "PIK 2\nJakarta", type: "property", price: 280000, rent: 65000, color: "#F4D03F", grid: "1/10/2/11", icon: "🏖️" },
    { id: 30, name: "OTT KPK\n(Masuk Sel)", type: "goto_jail", price: 0, rent: 0, grid: "1/11/2/12", corner: true, icon: "⚖️" },
    
    { id: 31, name: "PPN 12%", type: "tax", price: 150000, rent: 0, grid: "2/11/3/12", icon: "🧾" },
    { id: 32, name: "SCBD\nJakarta", type: "property", price: 300000, rent: 70000, color: "#229954", grid: "3/11/4/12", icon: "👔" },
    { id: 33, name: "Nasib Netizen", type: "card_netizen", price: 0, rent: 0, grid: "4/11/5/12" },
    { id: 34, name: "Pondok Indah\nJakarta", type: "property", price: 320000, rent: 75000, color: "#229954", grid: "5/11/6/12", icon: "🏰" },
    { id: 35, name: "Pelabuhan\nMerak", type: "property", price: 200000, rent: 40000, color: "#666", grid: "6/11/7/12", icon: "🚢" },
    { id: 36, name: "Orang Dalam", type: "card_dalam", price: 0, rent: 0, grid: "7/11/8/12" },
    { id: 37, name: "IKN", type: "property", price: 350000, rent: 80000, color: "#1F618D", grid: "8/11/9/12", icon: "🏛️" },
    { id: 38, name: "Pajak Barang\nMewah", type: "tax", price: 100000, rent: 0, grid: "9/11/10/12", icon: "💎" },
    { id: 39, name: "BSD City\nTangerang", type: "property", price: 400000, rent: 100000, color: "#1F618D", grid: "10/11/11/12", icon: "🏙️" }
];

const playerColors = ["#D62828", "#003049", "#FCBF49", "#386641"];
let gameState = { players: [], turn: 0, properties: Array(40).fill(null), isRolling: false };

// =========================================
// 4. SETUP & INITIALIZATION
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    const selCount = document.getElementById("player-count");
    const dynInputs = document.getElementById("dynamic-inputs");

    function renderInputs() {
        const count = parseInt(selCount.value);
        dynInputs.innerHTML = "";
        for(let i = 0; i < count; i++) {
            const div = document.createElement("div");
            div.className = "input-row";
            div.innerHTML = `
                <div class="dot" style="background-color: ${playerColors[i]}"></div>
                <input type="text" id="pname-${i}" placeholder="Nama Pemain ${i+1}" autocomplete="off">
            `;
            dynInputs.appendChild(div);
        }
    }

    selCount.addEventListener("change", renderInputs);
    renderInputs();

    document.getElementById("btn-start-game").addEventListener("click", () => {
        const count = parseInt(selCount.value);
        for(let i = 0; i < count; i++) {
            let nameVal = document.getElementById(`pname-${i}`).value.trim();
            if(!nameVal) nameVal = `Pemain ${i+1}`; 

            gameState.players.push({
                id: i, name: nameVal, color: playerColors[i],
                bal: 1500000, pos: 0, active: true, props: [],
                inJail: false, skipTurn: 0, skip: false, bebasSel: 0, bebasPajak: false
            });
        }
        
        document.getElementById("setup-modal").classList.add("hidden");
        document.getElementById("main-game").classList.remove("hidden");
        document.getElementById("guide-section").classList.remove("hidden");
        
        initGameUI();
        
        // Modal Notifikasi Awal + Log
        showModalAsync("🎮 GAME ON!", "Permainan dimulai! Selamat berjuang di Indonesia 😹", "GASKEUN!").then(() => {
            logAction("🎮 Permainan dimulai! Selamat berjuang di Indonesia 😹");
            prepareTurn();
        });
    });

    document.getElementById("btn-roll").addEventListener("click", handleDiceRollAsync);
    document.getElementById("btn-sell").addEventListener("click", () => openSellMarket(gameState.players[gameState.turn]));
});

function initGameUI() {
    const board = document.getElementById("board");
    boardSpaces.forEach(sp => {
        const div = document.createElement("div");
        div.className = `space ${sp.corner ? 'corner' : ''}`;
        div.style.gridArea = sp.grid;
        div.id = `space-${sp.id}`;
        
        let html = "";
        if(sp.color && !sp.corner) {
            html += `<div class="space-header" id="header-${sp.id}" style="background-color: ${sp.color}"></div>`;
        }
        html += `<div class="space-body">
                    <div class="space-name">${sp.name.replace(/\n/g, '<br>')}</div>
                    ${sp.price > 0 ? `<div class="space-price">Rp ${(sp.price/1000)}k</div>` : ''}
                 </div>
                 <div class="pawn-container" id="pawn-container-${sp.id}"></div>`;
        div.innerHTML = html;
        board.appendChild(div);
    });
    updatePlayersUI();
    renderAllPawns();
}

function updatePlayersUI() {
    const container = document.getElementById("player-list-container");
    container.innerHTML = "";
    gameState.players.forEach((p) => {
        const div = document.createElement("div");
        div.className = "player-card";
        div.id = `pcard-${p.id}`;
        div.style.color = p.color;
        if(!p.active) div.style.opacity = "0.3";

        const propNames = p.props.length ? p.props.map(id => boardSpaces[id].name.replace(/\n/g, ' ')).join(', ') : '-';
        div.innerHTML = `
            <h3><div class="dot" style="background:${p.color}; border-color:${p.color}; width:12px; height:12px; border-width:2px;"></div> ${p.name}</h3>
            <div class="saldo">Rp ${p.bal.toLocaleString('id-ID')}</div>
            <div class="props">Aset: ${propNames}</div>
            ${p.bebasSel > 0 ? `<div style="font-size:0.7rem; color:#D62828; margin-top:4px; font-weight:900;">🎟️ Bebas Sel: ${p.bebasSel}</div>` : ''}
        `;
        container.appendChild(div);
    });
}

function renderAllPawns() {
    document.querySelectorAll('.pawn').forEach(e => e.remove());
    gameState.players.forEach(p => {
        if(!p.active) return;
        const target = document.getElementById(`pawn-container-${p.pos}`);
        if(target) {
            const pawn = document.createElement("div");
            pawn.className = "pawn";
            pawn.id = `pawn-${p.id}`;
            pawn.style.backgroundColor = p.color;
            target.appendChild(pawn);
        }
    });
}

// =========================================
// 5. FITUR JUAL ASET (DARURAT / BEBAS)
// =========================================
function openSellMarket(p, debtAmount = 0, ownerToPay = null, successMsg = null) {
    if (p.props.length === 0) {
        if(debtAmount > 0) declareBankrupt(p, ownerToPay);
        else showModal("Pasar Aset", "Lu belum punya aset apa-apa buat dijual bro!", [{ text: "Tutup", action: () => {} }]);
        return;
    }

    const modal = document.getElementById("action-modal");
    document.getElementById("modal-title").innerText = "Pasar Aset (Hipotek)";
    
    let descHtml = debtAmount > 0 ? `<p style="color:#D62828; font-weight:900;">Duit lu kurang Rp ${(debtAmount - p.bal).toLocaleString('id-ID')} buat bayar tagihan!</p>` : `<p>Pilih aset yang mau dijual (50% dari harga awal).</p>`;
    descHtml += `<div class="sell-list" id="sell-list-container"></div>`;
    document.getElementById("modal-desc").innerHTML = descHtml;

    const renderSellList = () => {
        const listContainer = document.getElementById("sell-list-container");
        listContainer.innerHTML = "";
        p.props.forEach(propId => {
            const space = boardSpaces[propId];
            const sellPrice = space.price * 0.5;
            const item = document.createElement("div");
            item.className = "sell-item";
            item.innerHTML = `<span><b>${space.name.replace(/\n/g, ' ')}</b></span> <span style="color:#386641; font-weight:900;">+Rp ${sellPrice.toLocaleString('id-ID')}</span>`;
            item.onclick = () => {
                p.bal += sellPrice;
                p.props = p.props.filter(id => id !== propId);
                gameState.properties[propId] = null;
                
                // MURNI REVERT BACKGROUND HEADER SAJA, TANPA HAPUS BOX-SHADOW (karena emang gak ada)
                const spaceEl = document.getElementById(`space-${propId}`);
                document.getElementById(`header-${propId}`).style.backgroundColor = space.color;
                const icon = spaceEl.querySelector('.owner-icon');
                if (icon) icon.remove();
                
                playSound(sfx.buy);
                logAction(`🏷️ ${p.name} menjual ${space.name.replace(/\n/g, ' ')} ke Bank seharga Rp ${sellPrice.toLocaleString('id-ID')}.`);
                updatePlayersUI();
                
                if (p.props.length === 0) {
                    if (debtAmount > 0 && p.bal < debtAmount) declareBankrupt(p, ownerToPay);
                    else { modal.classList.add("hidden"); if(debtAmount > 0) checkAndPay(p, debtAmount, ownerToPay, successMsg); }
                } else {
                    renderSellList(); 
                    refreshActions();
                }
            };
            listContainer.appendChild(item);
        });
    };

    const refreshActions = () => {
        const actions = document.getElementById("modal-actions");
        actions.innerHTML = "";
        
        if (debtAmount > 0) {
            if (p.bal >= debtAmount) {
                const btnPay = document.createElement("button");
                btnPay.innerText = "Bayar Tagihan";
                btnPay.className = "btn-primary";
                btnPay.onclick = () => { modal.classList.add("hidden"); checkAndPay(p, debtAmount, ownerToPay, successMsg); };
                actions.appendChild(btnPay);
            } else {
                const btnNyerah = document.createElement("button");
                btnNyerah.innerText = "Nyerah (Bangkrut)";
                btnNyerah.className = "btn-secondary";
                btnNyerah.onclick = () => { modal.classList.add("hidden"); declareBankrupt(p, ownerToPay); };
                actions.appendChild(btnNyerah);
            }
        } else {
            const btnClose = document.createElement("button");
            btnClose.innerText = "Tutup Pasar";
            btnClose.className = "btn-primary";
            btnClose.onclick = () => modal.classList.add("hidden");
            actions.appendChild(btnClose);
        }
    };

    renderSellList();
    refreshActions();
    modal.classList.remove("hidden");
}

function checkAndPay(p, amount, ownerToPay, successMsg) {
    if (p.bal >= amount) {
        p.bal -= amount;
        if (ownerToPay) ownerToPay.bal += amount;
        playSound(sfx.pay);
        finishAction(successMsg);
    } else {
        openSellMarket(p, amount, ownerToPay, successMsg);
    }
}

async function declareBankrupt(p, ownerToPay) {
    p.active = false;
    logAction(`💀 BANGKRUT! ${p.name} pailit.`);
    
    if(ownerToPay && p.bal > 0) {
        ownerToPay.bal += p.bal;
    }
    p.bal = 0;

    p.props.forEach(id => {
        gameState.properties[id] = null;
        const spaceEl = document.getElementById(`space-${id}`);
        document.getElementById(`header-${id}`).style.backgroundColor = boardSpaces[id].color;
        const iconEl = spaceEl.querySelector('.owner-icon');
        if(iconEl) iconEl.remove();
    });
    p.props = [];
    renderAllPawns();
    
    await showModalAsync("BANGKRUT!", `${p.name} udah miskin total dan disita hartanya. Bye!`, "Nasib");
    await sleep(700);
    proceedToNextTurn();
}

// =========================================
// 6. CORE GAME LOOP & AUTO-SWITCH
// =========================================
function prepareTurn() {
    const p = gameState.players[gameState.turn];
    if (!p.active) return proceedToNextTurn();

    document.querySelectorAll('.player-card').forEach(c => {
        c.classList.remove('active-turn');
        c.style.borderColor = "#5C4033";
    });
    const activeCard = document.getElementById(`pcard-${p.id}`);
    activeCard.classList.add('active-turn');
    activeCard.style.borderColor = p.color;

    const btnRoll = document.getElementById("btn-roll");
    const btnSell = document.getElementById("btn-sell");
    
    btnRoll.disabled = false;
    btnRoll.classList.remove("hidden");
    if(p.props.length > 0) btnSell.classList.remove("hidden"); else btnSell.classList.add("hidden");
    
    if (p.skipTurn > 0) {
        logAction(`⏳ ${p.name} sedang dekem di Sel VVIP (Giliran Dilewati).`);
        p.skipTurn = 0;
        p.inJail = false; 
        btnRoll.classList.add("hidden");
        btnSell.classList.add("hidden");
        setTimeout(proceedToNextTurn, 1000);
        return;
    }

    if (p.skip) {
        p.skip = false;
        logAction(`⏳ ${p.name} kehilangan giliran putaran ini (Efek Kartu).`);
        btnRoll.classList.add("hidden");
        btnSell.classList.add("hidden");
        setTimeout(proceedToNextTurn, 1000);
        return;
    }

    if (p.inJail) {
        btnRoll.disabled = true; 
        btnSell.classList.add("hidden");
        handleJailEscapeRoutine(p, btnRoll);
        return;
    }
}

function handleJailEscapeRoutine(p, btnRoll) {
    const buttons = [
        { text: "Bayar Denda (Rp 50rb)", action: () => {
            checkAndPay(p, 50000, null, `💸 ${p.name} bayar denda KPK Rp 50.000. Bebas!`);
            p.inJail = false;
            btnRoll.disabled = false;
            document.getElementById("btn-sell").classList.remove("hidden");
        }}
    ];
    
    if (p.bebasSel > 0) {
        buttons.push({ text: "Pake Orang Dalam", action: () => {
            p.bebasSel--;
            p.inJail = false;
            playSound(sfx.card);
            logAction(`🎟️ ${p.name} pakai koneksi Orang Dalam. Bebas murni!`);
            updatePlayersUI();
            btnRoll.disabled = false;
            document.getElementById("btn-sell").classList.remove("hidden");
        }});
    }

    buttons.push({ text: "Dekem / Skip", secondary: true, action: () => {
        p.inJail = true; p.skipTurn = 1;
        logAction(`🔒 ${p.name} memilih dekem 1 putaran di Sel VVIP.`);
        document.getElementById("action-modal").classList.add("hidden");
        btnRoll.classList.add("hidden");
        setTimeout(proceedToNextTurn, 500);
    }});

    showModal("Tahanan Sel VVIP!", `${p.name}, lu mau keluar lewat jalan mana nih?`, buttons);
}

// =========================================
// 7. ANIMASI DADU & JALAN (STRICT ASYNC)
// =========================================
async function handleDiceRollAsync() {
    if (gameState.isRolling) return;
    gameState.isRolling = true;
    
    const btnRoll = document.getElementById("btn-roll");
    document.getElementById("btn-sell").classList.add("hidden"); 
    btnRoll.disabled = true;
    
    const p = gameState.players[gameState.turn];
    const el1 = document.getElementById("dice-1");
    const el2 = document.getElementById("dice-2");
    const faces = ['⚀','⚁','⚂','⚃','⚄','⚅'];

    playSound(sfx.dice);
    el1.classList.add("rolling");
    el2.classList.add("rolling");

    let shuffleInterval = setInterval(() => {
        el1.innerText = faces[Math.floor(Math.random() * 6)];
        el2.innerText = faces[Math.floor(Math.random() * 6)];
    }, 50);

    await sleep(500);
    clearInterval(shuffleInterval);
    el1.classList.remove("rolling");
    el2.classList.remove("rolling");

    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    const total = d1 + d2;
    
    el1.innerText = faces[d1-1];
    el2.innerText = faces[d2-1];

    logAction(`🎲 ${p.name} dapat angka ${d1} & ${d2} (Maju ${total}).`);
    
    await sleep(300);
    await movePawnSequential(p, total);
}

async function movePawnSequential(p, steps) {
    for (let i = 0; i < steps; i++) {
        p.pos++;
        if (p.pos >= 40) {
            p.pos = p.pos % 40;
            p.bal += 200000;
            playSound(sfx.buy);
            logAction(`💰 ${p.name} lewat START, cair Bansos +Rp 200.000!`);
            updatePlayersUI();
        }
        
        const targetContainer = document.getElementById(`pawn-container-${p.pos}`);
        const pawnEl = document.getElementById(`pawn-${p.id}`);
        if(targetContainer && pawnEl) targetContainer.appendChild(pawnEl);
        
        playSound(sfx.step);
        await sleep(200); 
    }
    
    await sleep(200);
    executeSpaceAction(p, boardSpaces[p.pos]);
}

// =========================================
// 8. AKSI PETAK & KEPEMILIKAN
// =========================================
function executeSpaceAction(p, space) {
    const spaceName = space.name.replace(/\n/g, ' ');
    
    if (space.type === "property") {
        const ownerId = gameState.properties[p.pos];
        
        if (ownerId === null) {
            if (p.bal >= space.price) {
                showModal("Lapak Kosong!", `Beli <b>${spaceName}</b>?<br>Harga: Rp ${space.price.toLocaleString('id-ID')}`, [
                    { text: "Beli Cuy", action: () => {
                        p.bal -= space.price; 
                        p.props.push(p.pos);
                        gameState.properties[p.pos] = p.id;
                        
                        // MURNI UBAH BACKGROUND HEADER PETAK (Sesuai emulasi desain awal lu)
                        document.getElementById(`header-${p.pos}`).style.backgroundColor = p.color;
                        
                        const iconEl = document.createElement("div");
                        iconEl.className = "owner-icon";
                        iconEl.innerText = space.icon || "🏠";
                        document.getElementById(`space-${p.pos}`).appendChild(iconEl);

                        playSound(sfx.buy);
                        finishAction(`🏠 ${p.name} resmi mengakuisisi ${spaceName}.`);
                    }},
                    { text: "Skip", secondary: true, action: () => finishAction(`Lewat doang di ${spaceName}.`) }
                ]);
            } else {
                finishAction(`💸 Duit ${p.name} gak cukup buat beli ${spaceName}.`);
            }
        } 
        else if (ownerId !== p.id) {
            const owner = gameState.players[ownerId];
            if (owner.inJail || !owner.active) {
                finishAction(`Nginjek lapak ${owner.name}, tapi dia lagi di Sel/Apes. Bebas Sewa!`);
            } else {
                checkAndPay(p, space.rent, owner, `💸 ${p.name} bayar sewa Rp ${space.rent.toLocaleString('id-ID')} ke ${owner.name}.`);
            }
        } else {
            finishAction(`Santai sejenak di aset sendiri (${spaceName}).`);
        }
    } 
    else if (space.type === "tax") {
        if (p.bebasPajak) {
            p.bebasPajak = false;
            finishAction(`🛡️ ${p.name} lolos dari tagihan pajak pakai Orang Dalam!`);
        } else {
            checkAndPay(p, space.price, null, `⚖️ ${p.name} menunaikan pajak Rp ${space.price.toLocaleString('id-ID')}.`);
        }
    }
    else if (space.type === "goto_jail") {
        playSound(sfx.jail);
        showModal("🚨 Kena OTT KPK! 🚨", "Aset lu diperiksa! Langsung diseret ke Sel VVIP tanpa ampun.", [
            { text: "Borgol Saya", action: async () => {
                p.pos = 10; p.inJail = true; p.skipTurn = 0;
                const targetContainer = document.getElementById(`pawn-container-10`);
                targetContainer.appendChild(document.getElementById(`pawn-${p.id}`));
                finishAction(`🚨 ${p.name} resmi pakai rompi oranye di Sel VVIP!`);
            }}
        ]);
    }
    else if (space.type === "card_netizen" || space.type === "card_dalam") {
        playSound(sfx.card);
        const isNetizen = space.type === "card_netizen";
        const deck = isNetizen ? netizenCards : orangDalamCards;
        const card = deck[Math.floor(Math.random() * deck.length)];
        
        showModal(isNetizen ? "Kartu Nasib Netizen" : "Kartu Orang Dalam", `<i>"${card.text}"</i>`, [
            { text: "OK Ngerti", action: async () => {
                let cardTitle = card.text.split(':')[0];
                let cardTypeStr = isNetizen ? "Netizen" : "Orang Dalam";
                let msg = `🃏 ${p.name} dapet Kartu ${cardTypeStr}: '${cardTitle}'`;
                
                if (card.type === "money") {
                    if (card.value < 0) {
                        msg += ` (Rugi Rp ${Math.abs(card.value).toLocaleString('id-ID')})`;
                        checkAndPay(p, Math.abs(card.value), null, msg);
                        return;
                    } else {
                        p.bal += card.value;
                        playSound(sfx.buy);
                        msg += ` (+Rp ${card.value.toLocaleString('id-ID')})`;
                    }
                }
                
                if (card.type === "skip") p.skip = true;
                if (card.type === "bebas_sel") p.bebasSel++;
                if (card.type === "bebas_pajak") p.bebasPajak = true;
                
                updatePlayersUI();
                
                if (card.type === "move") {
                    logAction(msg);
                    await movePawnSequential(p, card.value);
                } else {
                    finishAction(msg);
                }
            }}
        ]);
    } 
    else {
        if (space.id === 10) finishAction(`👀 ${p.name} cuma mampir besuk tahanan di Sel VVIP.`);
        else finishAction(`☕ ${p.name} mendarat aman di ${spaceName}.`);
    }
}

// =========================================
// 9. FINALISASI & AUTO-SWITCH GILIRAN
// =========================================
async function finishAction(logMessage) {
    logAction(logMessage);
    updatePlayersUI();
    await sleep(700); 
    proceedToNextTurn();
}

function proceedToNextTurn() {
    const activePlayers = gameState.players.filter(p => p.active);
    
    if (activePlayers.length === 1) {
        showModal("🏆 GAME OVER! 🏆", `Satu-satunya sultan yang tersisa adalah <b>${activePlayers[0].name}</b>!`, [
            { text: "Main Ulang", action: () => location.reload() }
        ]);
        return;
    }

    do {
        gameState.turn = (gameState.turn + 1) % gameState.players.length;
    } while (!gameState.players[gameState.turn].active);

    gameState.isRolling = false;
    document.getElementById("btn-roll").classList.add("hidden");
    document.getElementById("btn-sell").classList.add("hidden");
    
    prepareTurn();
}

// =========================================
// 10. MODAL UTILITIES
// =========================================
function showModal(title, desc, buttons) {
    const modal = document.getElementById("action-modal");
    document.getElementById("modal-title").innerText = title;
    document.getElementById("modal-desc").innerHTML = desc;
    
    const actions = document.getElementById("modal-actions");
    actions.innerHTML = "";
    
    buttons.forEach(b => {
        const btn = document.createElement("button");
        btn.innerText = b.text;
        btn.className = b.secondary ? "btn-secondary" : "btn-primary";
        btn.onclick = () => {
            modal.classList.add("hidden");
            if (b.action) b.action();
        };
        actions.appendChild(btn);
    });
    
    modal.classList.remove("hidden");
}

function showModalAsync(title, desc, btnText) {
    return new Promise(resolve => {
        showModal(title, desc, [{ text: btnText, action: resolve }]);
    });
}

function logAction(msg) {
    const logBox = document.getElementById("game-log");
    const li = document.createElement("li");
    li.innerText = msg;
    logBox.appendChild(li);
    logBox.parentElement.scrollTop = logBox.parentElement.scrollHeight;
}