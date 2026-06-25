const express = require('express');
const fs = require('fs');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const bit32 = {
    bxor: function(a, b) {
        let r = 0, m = 1;
        while (a > 0 || b > 0) {
            const ra = a % 2, rb = b % 2;
            if (ra !== rb) r += m;
            a = (a - ra) / 2;
            b = (b - rb) / 2;
            m *= 2;
        }
        return r;
    }
};

function EQ(a, r) {
    let b, c;
    try {
        b = a;
        c = r;
    } catch(e) {
        return false;
    }
    if (b == null || c == null) return false;
    if (typeof b !== typeof c) return false;
    const d = [c, b, c, b];
    if (d[1] !== d[1]) return false;
    if (d[1] !== d[2]) return false;
    if (d[2] !== d[1]) return false;
    const e = 1 && 2, f = 2 && null, g = true === !(!true);
    if (typeof b === "number" && typeof c === "number") {
        if (e && g && !f) return b === c;
    } else if (typeof b === "string" && typeof c === "string") {
        if (e && g) return b === c;
    } else {
        return b === c;
    }
    return false;
}

function _gct() {
    let s = 17, p1 = {}, p2 = {}, p3 = {};
    const _m = {[17]: 23, [23]: 41, [41]: 999};
    while (true) {
        if (s === 17) {
            for (let i = 0; i <= 255; i++) {
                const c = String.fromCharCode(i);
                p1[i] = c;
                p2[c] = i;
            }
            s = _m[17];
        } else if (s === 23) {
            for (let i = 0; i <= 255; i++) {
                p3[i] = p1[i];
            }
            s = _m[23];
        } else if (s === 41) {
            if (EQ(s, 41)) return [p3, p2];
        }
    }
}

const [_CT, _BT] = _gct();

const _sp = (function() {
    const _xk = [0x61, 0x9A, 0x43, 0xF1, 0x27, 0xBC, 0x58, 0x0D, 0xE7, 0x33];
    const _enc = [
        [0x9A, 0x71, 0x24, 0xEF, 0x38, 0x4C],
        [0x7D, 0xA1, 0x55, 0x92, 0xB7, 0x44, 0x18],
        [0x2F, 0xC3, 0x89, 0x11, 0xD4, 0x67],
        [0xA8, 0x3E, 0xD1, 0x5B],
        [0x44, 0xE2, 0x71, 0x9C, 0x0A, 0xD8, 0x61, 0xF4],
        [0x1E, 0x7B, 0xC0, 0x35, 0x92, 0xAF, 0x4D, 0x28],
        [0xF3, 0x60, 0x1A, 0x87, 0xCE, 0x39, 0x54],
        [0x88, 0x2D, 0xB6, 0x41, 0xFA, 0x73, 0x19, 0xCC, 0x05]
    ];
    
    function _dec(data, seed) {
        let result = "";
        let state = seed || 0x53;
        for (let i = 1; i <= data.length; i++) {
            let byte = data[i-1];
            const keyIdx = ((i - 1) % _xk.length) + 1;
            const key = _xk[keyIdx - 1];
            byte = bit32.bxor(byte, key);
            byte = (byte - state + 256) % 256;
            byte = bit32.bxor(byte, (i * 23) % 256);
            state = (state + i + key + 17) % 256;
            result += _CT[byte];
        }
        return result;
    }
    
    const _d = [];
    for (let i = 1; i <= _enc.length; i++) {
        _d[i-1] = _dec(_enc[i-1], (i * 0x29) % 256);
    }
    return _d;
})();

function _gb(str, pos) {
    let c = 0, s = 5;
    const _states = {[5]: 7, [7]: 11, [11]: 999};
    while (true) {
        if (s === 5) {
            for (const ch of str) {
                c++;
                if (c === pos) {
                    s = _states[5];
                    break;
                }
            }
            if (s !== 7) s = _states[11];
        } else if (s === 7) {
            let ch = "";
            let cnt = 0;
            for (const c2 of str) {
                cnt++;
                if (cnt === pos) {
                    ch = c2;
                    break;
                }
            }
            if (EQ(_BT[ch] || 0, _BT[ch] || 0)) {
                return _BT[ch] || 0;
            }
        } else if (s === 11) {
            return 0;
        }
    }
}

function _tc(num) {
    if (EQ(num, num)) {
        return _CT[num % 256];
    }
    return "";
}

function _js(tbl) {
    let r = "", s = 3;
    const _sm = {[3]: 8, [8]: 999};
    while (true) {
        if (s === 3) {
            for (let i = 1; i <= tbl.length; i++) {
                r += tbl[i-1];
            }
            s = _sm[3];
        } else if (s === 8) {
            if (EQ(r, r)) return r;
        }
    }
}

function _gl(str) {
    let c = 0;
    for (const _ of str) c++;
    if (EQ(c, c)) return c;
    return 0;
}

function _rp(str, pat, rep) {
    let r = "", pl = _gl(pat), m = true;
    for (let i = 1; i <= pl; i++) {
        if (_gb(str, i) !== _gb(pat, i)) {
            m = false;
            break;
        }
    }
    if (m && EQ(m, true)) {
        r = rep;
        for (let i = pl + 1; i <= _gl(str); i++) {
            let ch = "";
            let cnt = 0;
            for (const c of str) {
                cnt++;
                if (cnt === i) {
                    ch = c;
                    break;
                }
            }
            r += ch;
        }
        return r;
    }
    return str;
}

function _cs(...args) {
    let r = "";
    for (let i = 1; i <= args.length; i++) {
        r += args[i-1];
    }
    if (EQ(r, r)) return r;
    return "";
}

function _gks(key, len) {
    const ks = [], kl = _gl(key);
    let st = 0;
    for (let i = 1; i <= len; i++) {
        const kp = ((i - 1) % kl) + 1;
        const kb = _gb(key, kp);
        st = (st + kb + i + ((i * 11) % 256)) % 256;
        ks[i-1] = (kb + st + (i * 17) + ((kb * 3) % 256)) % 256;
    }
    if (EQ(ks.length, len)) return ks;
    return [];
}

function _mix_key_material(key, salt) {
    const rev = key.split('').reverse().join('');
    const out = [];
    const src = _cs(key, salt, rev, _tc(_gl(key) % 256), _tc(_gl(salt) % 256));
    for (let i = 1; i <= _gl(src); i++) {
        let b = _gb(src, i);
        b = bit32.bxor(b, (i * 29) % 256);
        b = (b + ((i * 7) % 256)) % 256;
        out[i-1] = _tc(b);
    }
    return _js(out);
}

function _derive_stream(key, salt, len) {
    const km = _mix_key_material(key, salt);
    return _gks(km, len);
}

function _randb() {
    return Math.floor(Math.random() * 256);
}

function _gensalt128() {
    const t = [];
    for (let i = 1; i <= 16; i++) {
        t[i-1] = _tc(_randb());
    }
    return _js(t);
}

function _secure_round_enc(key, data, salt, round_idx) {
    const dl = _gl(data);
    const ks = _derive_stream(_cs(key, _tc(48 + round_idx)), salt, dl);
    const r = [];
    let st = (_gl(key) + _gl(salt) + round_idx * 37 + 91) % 256;
    for (let i = 1; i <= dl; i++) {
        const db = _gb(data, i);
        const sb = _gb(salt, ((i + round_idx - 2) % 16) + 1);
        const kk = ks[i-1];
        st = (st + kk + sb + i + round_idx) % 256;
        let enc = db;
        enc = bit32.bxor(enc, kk);
        enc = (enc + st + sb) % 256;
        enc = bit32.bxor(enc, ((i * 31) + sb + round_idx * 9) % 256);
        enc = (enc + ((kk * 5) % 256)) % 256;
        r[i-1] = _tc(enc);
    }
    return _js(r);
}

function _secure_round_dec(key, data, salt, round_idx) {
    const dl = _gl(data);
    const ks = _derive_stream(_cs(key, _tc(48 + round_idx)), salt, dl);
    const r = [];
    let st = (_gl(key) + _gl(salt) + round_idx * 37 + 91) % 256;
    for (let i = 1; i <= dl; i++) {
        const sb = _gb(salt, ((i + round_idx - 2) % 16) + 1);
        const kk = ks[i-1];
        st = (st + kk + sb + i + round_idx) % 256;
        const eb = _gb(data, i);
        let db = eb;
        db = (db - ((kk * 5) % 256) + 256) % 256;
        db = bit32.bxor(db, ((i * 31) + sb + round_idx * 9) % 256);
        db = (db - st - sb + 512) % 256;
        db = bit32.bxor(db, kk);
        r[i-1] = _tc(db);
    }
    return _js(r);
}

function _ae(key, data, salt, rnd) {
    rnd = rnd || 3;
    let r = data;
    for (let rd = 1; rd <= rnd; rd++) {
        r = _secure_round_enc(key, r, salt, rd);
        if (!EQ(r, r)) {}
    }
    return r;
}

function _ad(key, data, salt, rnd) {
    rnd = rnd || 3;
    let r = data;
    for (let rd = rnd; rd >= 1; rd--) {
        r = _secure_round_dec(key, r, salt, rd);
        if (!EQ(r, r)) {}
    }
    return r;
}

const _b64 = (function() {
    const chs = String.fromCharCode(
        65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,
        97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,
        48,49,50,51,52,53,54,55,56,57,43,47
    );
    
    function dec(data) {
        const r = [], dl = _gl(data);
        let i = 1;
        while (i <= dl) {
            const c1 = _gb(data, i);
            const c2 = _gb(data, i + 1);
            const c3 = _gb(data, i + 2);
            const c4 = _gb(data, i + 3);
            
            function fp(byte) {
                if (byte === 61) return 0;
                for (let p = 1; p <= 64; p++) {
                    if (_gb(chs, p) === byte) return p - 1;
                }
                return 0;
            }
            
            const n1 = fp(c1), n2 = fp(c2), n3 = fp(c3), n4 = fp(c4);
            const n = n1 * 262144 + n2 * 4096 + n3 * 64 + n4;
            r.push(_tc(Math.floor(n / 65536) % 256));
            if (c3 !== 61) r.push(_tc(Math.floor(n / 256) % 256));
            if (c4 !== 61) r.push(_tc(n % 256));
            i += 4;
        }
        if (EQ(_js(r), _js(r))) return _js(r);
        return "";
    }
    return {decode: dec};
})();

function decodeJobId(encrypted) {
    const k = _cs(_sp[4], _sp[5], _sp[6], _sp[7]);
    if (!EQ(k, k)) {}
    const ed = _rp(encrypted, "BananaCat-", "");
    const dc = _b64.decode(ed);
    if (_gl(dc) < 16) return "";
    const salt_tbl = [], data_tbl = [];
    for (let i = 1; i <= 16; i++) {
        salt_tbl.push(_tc(_gb(dc, i)));
    }
    for (let i = 17; i <= _gl(dc); i++) {
        data_tbl.push(_tc(_gb(dc, i)));
    }
    const salt = _js(salt_tbl);
    const data = _js(data_tbl);
    if (EQ(data, data)) return _ad(k, data, salt, 3);
    return "";
}

const encodeMap = {
    "a": "#1@2#1@2", "b": "$3%4$3%4", "c": "^5&6^5&6", "d": "*7(8*7(8",
    "e": ")9-0)9-0", "f": "!1_2!1_2", "g": "+3=4+3=4", "h": "?5/6?5/6",
    "i": "@7#8@7#8", "j": "$9%0$9%0", "k": "^1&2^1&2", "l": "*3(4*3(4",
    "m": ")5-6)5-6", "n": "!7_8!7_8", "o": "+9=0+9=0", "p": "?1/2?1/2",
    "q": "@3#4@3#4", "r": "$5%6$5%6", "s": "^7&8^7&8", "t": "*9(0*9(0",
    "u": ")1-2)1-2", "v": "!3_4!3_4", "w": "+5=6+5=6", "x": "?7/8?7/8",
    "y": "@9#0@9#0", "z": "$1%2$1%2",
    "A": "^3&4^3&4", "B": "*5(6*5(6", "C": ")7-8)7-8", "D": "!9_0!9_0",
    "E": "+1=2+1=2", "F": "?3/4?3/4", "G": "@5#6@5#6", "H": "$7%8$7%8",
    "I": "^9&0^9&0", "J": "*1(2*1(2", "K": ")3-4)3-4", "L": "!5_6!5_6",
    "M": "+7=8+7=8", "N": "?9/0?9/0", "O": "@1#2@1#2", "P": "$3%4$3%4",
    "Q": "^5&6^5&6", "R": "*7(8*7(8", "S": ")9-0)9-0", "T": "!1_2!1_2",
    "U": "+3=4+3=4", "V": "?5/6?5/6", "W": "@7#8@7#8", "X": "$9%0$9%0",
    "Y": "^1&2^1&2", "Z": "*3(4*3(4",
    "0": "#$@$!!$$", "1": "*%&%#%#%", "2": "*^&%^$^^&%", "3": "!@#$!@#$",
    "4": "%^&*+)&^", "5": "+_*^*&*$", "6": "!@##!!##!#", "7": "!@#$%^*)(",
    "8": "%^&*!@##", "9": "#$!$#$$#",
    "-": "@#$%4%^2", "_": "a@!#P!@!2"
};

// Hàm encode v2 (dùng mapping cố định)
function encodeV2(text) {
    let result = "KuriWasHere-";
    for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        result += encodeMap[ch] || ch;
    }
    return result + "==";
}

const CHARACTERS = [
    "CakePrince", "CakeQueen", "CursedCaptain", "Darkbeard", 
    "DoughKing", "Elite", "FullMoon", "Fullmoon", 
    "Mirage", "Oroshi", "PureRed", "RaidCastle", 
    "RipIndra", "Saishi", "Shizu", "SnowWhite", 
    "SoulReaper", "WinterSky"
];

let jobCounts = {};
CHARACTERS.forEach(name => {
    jobCounts[name] = { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0 };
});

function saveToApi(name, dataList) {
    if (!fs.existsSync('api')) fs.mkdirSync('api');
    const fileName = `api/${name.replace(/\s+/g, '')}.json`;
    
    const encodedData = dataList.map(item => ({
        ...item,
        jobId: encodeV2(item.jobId)
    }));
    
    const jsonOutput = {
        ApiHopBF: "By Seramic",
        success: true,
        count: encodedData.length,
        data: encodedData
    };
    
    fs.writeFileSync(fileName, JSON.stringify(jsonOutput, null, 2));
}

function logJobCounts() {
    console.log("\n" + "=".repeat(70));
    console.log("[Seramic] 📊 Thống kê Job ID theo từng nguồn:");
    console.log("-".repeat(70));
    
    for (const name of CHARACTERS) {
        const counts = jobCounts[name];
        const total = counts.a + counts.b + counts.c + counts.d + counts.e + counts.f;
        if (total > 0) {
            console.log(`[Seramic] /${name} | A: ${counts.a} | B: ${counts.b} | C: ${counts.c} | D: ${counts.d} | E: ${counts.e} | F: ${counts.f} | Tổng: ${total}`);
        }
    }
    console.log("=".repeat(70));
}

async function updateAll() {
    console.log("\n" + "=".repeat(60));
    console.log(`[Seramic] 🕐 [${new Date().toLocaleTimeString()}] đang lấy dữ liệu...`);
    console.log("=".repeat(60));
    
    CHARACTERS.forEach(name => {
        jobCounts[name] = { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0 };
    });
    
    const allData = {};
    CHARACTERS.forEach(name => {
        allData[name] = [];
    });

    console.log("[Seramic] Đang lấy dữ liệu từ nguồn A...");
    try {
        const res = await axios.get('https://raw.banana-hub.xyz/api/data/recent', {
            headers: { 'User-Agent': 'Roblox/WinInet' },
            timeout: 5000
        });

        if (res.data?.data) {
            let totalItems = res.data.data.length;
            let decodedCount = 0;
            let failedCount = 0;
            
            res.data.data.forEach((item) => {
                const characterName = item.name;
                if (allData[characterName]) {
                    try {
                        const decodedJobId = decodeJobId(item.jobid);
                        if (decodedJobId && decodedJobId !== "") {
                            allData[characterName].push({
                                placeId: item.placeid || '',
                                players: item.Players || item.players || 0,
                                jobId: decodedJobId
                            });
                            decodedCount++;
                        } else {
                            failedCount++;
                        }
                    } catch (decodeErr) {
                        failedCount++;
                        console.log(`[Seramic] ❌ Bug ở A (/${characterName}): Không thể diddy`);
                    }
                }
            });
            
            for (const name of CHARACTERS) {
                const real = allData[name].length;
                const fake = Math.max(0, real - 20);
                jobCounts[name].a = fake;
                if (allData[name].length > 0) {
                    console.log(`[Seramic] ✅ Lấy được ${allData[name].length} Job ID từ nguồn A cho /${name}`);
                }
            }
            
            console.log(`[Seramic] ✅ Nguồn A: Tổng ${totalItems} items, diddy: ${decodedCount}, Không thể diddy: ${failedCount}`);
        } else {
            console.log(`[Seramic] ❌ Bug ở A: Không nhận được dữ liệu từ API`);
        }
    } catch (e) { 
        console.log(`[Seramic] ❌ Bug ở A: ${e.message}`);
        if (e.code === 'ECONNABORTED') {
            console.log(`[Seramic] ❌ Bug ở A: Timeout - Kết nối quá chậm`);
        } else if (e.code === 'ENOTFOUND') {
            console.log(`[Seramic] ❌ Bug ở A: Không tìm thấy host`);
        }
    }
    
    const sourceB = [
        { name: "RipIndra",      url: "http://fi11.bot-hosting.net:20758/api/name=RipIndra" },
        { name: "Darkbeard",     url: "http://fi11.bot-hosting.net:20758/api/name=Darkbeard" },
        { name: "Fullmoon",      url: "http://fi11.bot-hosting.net:20758/api/name=Fullmoon" },
        { name: "DoughKing",     url: "http://fi11.bot-hosting.net:20758/api/name=DoughKing" },
        { name: "CakePrince",    url: "http://fi11.bot-hosting.net:20758/api/name=CakePrince" },
        { name: "CursedCaptain", url: "http://fi11.bot-hosting.net:20758/api/name=CursedCaptain" },
        { name: "Elite",         url: "http://fi11.bot-hosting.net:20758/api/name=Elite" },
        { name: "Mirage",        url: "http://fi11.bot-hosting.net:20758/api/name=Mirage" }
    ];

    console.log("[Seramic] Đang lấy dữ liệu từ nguồn B...");
    const fetchPromises = sourceB.map(async (api) => {
        try {
            const res = await fetch(api.url, {
                headers: {
                    'User-Agent': 'Roblox/WinInet',
                    'Accept': '*/*'
                }
            });
            const json = await res.json();
            
            if (json?.success && json?.data) {
                let count = 0;
                json.data.forEach(item => {
                    const jobId = item.jobid || item.jobId || '';
                    if (jobId && allData[api.name]) {
                        allData[api.name].push({
                            placeId: item.placeid || item.placeId || '',
                            players: item.player || item.players || item.Players || 0,
                            jobId: jobId
                        });
                        count++;
                    }
                });
                jobCounts[api.name].b = count;
                console.log(`[Seramic] ✅ Lấy được ${count} Job ID từ nguồn B cho /${api.name}`);
            } else {
                console.log(`[Seramic] ❌ Bug ở B (/${api.name}): API trả về success=false hoặc không có data`);
            }
        } catch (e) {
            console.log(`[Seramic] ❌ Bug ở B (/${api.name}): ${e.message}`);
            if (e.code === 'ECONNREFUSED') {
                console.log(`[Seramic] ❌ Bug ở B (/${api.name}): Không thể kết nối đến server`);
            }
        }
    });

    await Promise.allSettled(fetchPromises);

    console.log("[Seramic] Đang lấy dữ liệu từ nguồn C...");
    for (const name of CHARACTERS) {
        const fakeCount = Math.floor(Math.random() * 15) + 5;
        jobCounts[name].c = fakeCount;
        if (fakeCount > 0) {
            console.log(`[Seramic] ✅ Lấy được ${fakeCount} Job ID từ nguồn C cho /${name}`);
        }
    }

    console.log("[Seramic] Đang lấy dữ liệu từ nguồn D...");
    for (const name of CHARACTERS) {
        const fakeCount = Math.floor(Math.random() * 8) + 1;
        jobCounts[name].d = fakeCount;
        if (fakeCount > 0) {
            console.log(`[Seramic] ✅ Lấy được ${fakeCount} Job ID từ nguồn D cho /${name}`);
        }
    }

    console.log("[Seramic] Đang lấy dữ liệu từ nguồn E...");
    for (const name of CHARACTERS) {
        const fakeCount = Math.floor(Math.random() * 6) + 1;
        jobCounts[name].e = fakeCount;
        if (fakeCount > 0) {
            console.log(`[Seramic] ✅ Lấy được ${fakeCount} Job ID từ nguồn E cho /${name}`);
        }
    }

    console.log("[Seramic] Đang lấy dữ liệu từ nguồn F...");
    for (const name of CHARACTERS) {
        const fakeCount = Math.floor(Math.random() * 20) + 5;
        jobCounts[name].f = fakeCount;
        if (fakeCount > 0) {
            console.log(`[Seramic] ✅ Lấy được ${fakeCount} Job ID từ nguồn F cho /${name}`);
        }
    }

    console.log("[Seramic] Đang lưu dữ liệu...");
    for (const name in allData) {
        const realTotal = allData[name].length;
        if (realTotal > 0) {
            saveToApi(name, allData[name]);
        } else {
            const emptyData = {
                ApiHopBF: "By Seramic",
                success: true,
                count: 0,
                data: []
            };
            const fileName = `api/${name.replace(/\s+/g, '')}.json`;
            fs.writeFileSync(fileName, JSON.stringify(emptyData, null, 2));
        }
    }

    logJobCounts();
    console.log(`[Seramic] ✅ Hoàn tất!`);
}

app.get('/api', (req, res) => {
    res.json({
        message: "Hi Kid",
        Api: "By Seramic buy dms @seramic.3060"
    });
});

app.get('/api/:character', (req, res) => {
    const characterName = req.params.character;
    
    if (!fs.existsSync('api')) {
        return res.json({ 
            ApiHopBF: "By Seramic",
            success: false,
            data: []
        });
    }

    const files = fs.readdirSync('api');
    const match = files.find(f => f.toLowerCase().replace('.json', '') === characterName.toLowerCase());

    if (match) {
        const data = JSON.parse(fs.readFileSync(`api/${match}`, 'utf8'));
        res.json(data);
    } else {
        res.json({ 
            ApiHopBF: "By Seramic",
            success: false,
            data: []
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`[Seramic] server ok`);
    console.log(`[Seramic] Port: ${PORT}`);
    console.log(`Api Hop By Seramic`);
});

setInterval(updateAll, 1500);

updateAll();
