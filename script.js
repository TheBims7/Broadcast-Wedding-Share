function gantiSapaan(teks, gelar) {
    if (!teks) return teks;

    // Tentukan kata pengganti
    let pengganti = gelar; // 'Bapak' / 'Ibu' / 'Saudara' / 'Saudari'
    if (!pengganti) pengganti = 'Bapak/Ibu/Saudara/i'; // fallback kalau gelar kosong

    // Pola yang mau ditangkap:
    // Bapak/Ibu/Saudara/i  |  Bapak/Ibu/Saudara  |  Bapak/Ibu  |  Bapak / Ibu / Saudara / Saudari
    // juga variasi dengan spasi & garis miring
    const pola = /Bapak\s*\/\s*Ibu\s*\/\s*Saudara\s*\/?\s*i?|Bapak\s*\/\s*Ibu\s*\/\s*Saudara|Bapak\s*\/\s*Ibu|Saudara\s*\/\s*i/gi;

    return teks.replace(pola, pengganti);
}

function Generate() {
    const nama   = document.getElementById('nama').value.trim();
    const gelar  = document.getElementById('gelar')?.value  || '';
    const lokasi = document.getElementById('lokasi')?.value || '';
    const link   = document.getElementById('link').value.trim();
    let   awal   = document.getElementById('broadcastAwal').value.trim();
    let   akhir  = document.getElementById('broadcastAkhir').value.trim();

    if (!nama) {
        showToast('Nama penerima harus diisi!', 'error');
        return;
    }

    // ✅ Ganti sapaan di broadcast sesuai gelar
    awal  = gantiSapaan(awal, gelar);
    akhir = gantiSapaan(akhir, gelar);

    // === Mapping kode gelar ===
    const kodeGelar = {
        'Bapak'   : 'b',
        'Ibu'     : 'i',
        'Saudara' : 'sdr',
        'Saudari' : 'sdri'
    };

    // === Mapping kode lokasi ===
    const kodeLokasi = {
        'Tegalrejo'       : 't',
        'Mangun Suparnan' : 'j'
    };

    // === Bangun URL dengan query parameter ===
    let urlFinal = link;
    if (link) {
        // Pisahkan base URL dari query lama (kalau ada)
        let baseUrl = link;
        let queryLama = '';
        const idxTanya = link.indexOf('?');
        if (idxTanya !== -1) {
            baseUrl = link.substring(0, idxTanya);
            queryLama = link.substring(idxTanya + 1);
        }

        baseUrl = baseUrl.replace(/\/+$/, '');

        // Kumpulkan parameter
        const params = [];
        if (queryLama) params.push(queryLama);
        if (gelar && kodeGelar[gelar]) params.push(kodeGelar[gelar]);
        if (lokasi && kodeLokasi[lokasi]) params.push(kodeLokasi[lokasi]);
        params.push('to=' + encodeURIComponent(nama));

        urlFinal = baseUrl + '/?' + params.join('&');
    }

    // === Bangun sapaan ===
    let sapaan = '';
    if (gelar) sapaan += gelar + ' ';
    sapaan += nama;

    // === Susun hasil ===
    let hasil = '';
    
    // 1. Kepada Yth.
    hasil += 'Kepada Yth.\n';
    hasil += sapaan + '\n';
    if (lokasi) hasil += 'di Tempat' + '\n';
    hasil += '\n';

    // 2. Broadcast Awal
    if (awal) hasil += awal + '\n\n';


    // 3. Link undangan
    if (urlFinal) {
        hasil += 'Untuk informasi detail Acara, Lokasi, dan Waktu lebih lengkap bisa akses link undangan berikut :\n';
        hasil += urlFinal + '\n';
    }

    // 4. Broadcast Akhir (paling bawah)
    if (akhir) hasil += '\n' + akhir;

    document.getElementById('hasil').textContent = hasil.trim();
    showToast('Berhasil digenerate!');
}

function showToast(msg, tipe = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.className = 'toast';           // reset class
    if (tipe === 'error') {
        toast.classList.add('error');
    }
    toast.style.display = 'block';
    setTimeout(() => toast.style.display = 'none', 1500);
}

function copyText() {
    const teks = document.getElementById('hasil').textContent;
    if (!teks.trim()) {
        showToast('Tidak ada teks untuk dicopy', 'error');
        return;
    }
    navigator.clipboard.writeText(teks)
        .then(() => showToast('Text Berhasil dicopy'))
        .catch(err => {
            console.error('Text gagal copy', err);
            showToast('Gagal menyalin teks');
        });
}

function clearText() {
    document.getElementById('nama').value = '';
    document.getElementById('gelar').value = '';
    document.getElementById('lokasi').value = '';
    document.getElementById('link').value = '';
    document.getElementById('broadcastAwal').value = '';
    document.getElementById('broadcastAkhir').value = '';
    document.getElementById('hasil').textContent = '';
    showToast('Form berhasil direset');
}
