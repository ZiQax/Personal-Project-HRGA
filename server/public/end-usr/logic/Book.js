// ============================================================================
// 1. SETUP VARIABEL GLOBAL & SELEKTOR DOM
// ============================================================================
const apiURL = 'http://localhost:3000/api/izin/log/pagination'
let currentPage = 1
let limit = 10
let currentEditingId = null

// Elemen Table & Pagination
const tbody = document.getElementById('body')
const limitSelect = document.getElementById('limitSelect')
const pageInfo = document.getElementById('pageInfo')
const prevBtn = document.getElementById('prevBtn')
const nextBtn = document.getElementById('nextBtn')

// Elemen Modal Edit
const modalEdit = document.getElementById('modalEdit')
const editName = document.getElementById('editName')
const editReason = document.getElementById('editReason')
const editStatus = document.getElementById('editStatus')
const saveEditBtn = document.getElementById('saveEdit')
const closeModalBtn = document.getElementById('closeModal')
const modalSuccess = document.getElementById('modalEditSuccess')
const modalDeleteSuccess = document.getElementById('modalDeleteSuccess')

// Elemen KPI Cards (Top Dashboard)
const pendingCount = document.getElementById('pending-count')
const approvedCount = document.getElementById('approved-count')
const rejectedCount = document.getElementById('rejected-count')

// Auth & User Info
const token = localStorage.getItem('token')
const user = JSON.parse(localStorage.getItem('user'))

// ============================================================================
// 2. INISIALISASI (Saat Halaman Dibuka)
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  checkAuth()
  setupUserInfo()
  setupEventListeners()
  loadFromApi(1) // Load data pertama kali
})

function checkAuth () {
  if (!token || !user) {
    window.location.href = 'login.html'
  }
}

function setupUserInfo () {
  const namU = document.getElementById('nam-u')
  const emailU = document.getElementById('email-u')
  if (namU && emailU) {
    namU.textContent = `NIK : ${user.nik || '-'}`
    emailU.textContent = `Username : ${user.username || '-'}`
  }
}

// ============================================================================
// 3. EVENT LISTENERS GLOBAL (Hanya Dideklarasikan Sekali)
// ============================================================================
function setupEventListeners () {
  // Logout
  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.clear()
    window.location.href = 'login.html'
  })

  // Ganti Limit Baris
  limitSelect.addEventListener('change', (e) => {
    limit = parseInt(e.target.value)
    currentPage = 1
    loadFromApi(1)
  })

  // Tutup Modal Edit
  closeModalBtn.addEventListener('click', () => {
    modalEdit.style.display = 'none'
    resetForm()
  })

  // Simpan Data Edit
  saveEditBtn.addEventListener('click', handleSaveEdit)

  // KPI Card Buttons (Filter Status)
  setupKpiButtons()
}

function setupKpiButtons () {
  const map = {
    'pending-button': 'pending',
    'approved-button': 'approved',
    'rejected-button': 'rejected'
  }

  for (const [id, status] of Object.entries(map)) {
    const btn = document.getElementById(id)
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault()
        handleLogStatus(status)
      })
    }
  }
}

// ============================================================================
// 4. LOGIC UTAMA: LOAD DATA & RENDER TABEL
// ============================================================================
async function loadFromApi (page = 1) {
  try {
    currentPage = page
    console.log(`Fetching page ${page} with limit ${limit}...`)

    const response = await fetch(`${apiURL}?page=${page}&limit=${limit}`)
    const result = await response.json()

    if (!response.ok) throw new Error(result.message || response.statusText)

    const data = result.data || []
    renderTable(data)

    // Update Pagination & Status Counters
    if (result.pagination) updatePagination(result.pagination)
    updateStatusCounters()
  } catch (error) {
    console.error('Error loading data:', error)
    tbody.innerHTML = '<tr><td colspan="10" style="text-align:center;">Gagal memuat data / Data kosong</td></tr>'
  }
}

function renderTable (data) {
  tbody.innerHTML = ''

  if (data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="10" style="text-align:center;">Data Tidak Ditemukan</td></tr>'
    return
  }

  data.forEach((item, index) => {
    const tr = document.createElement('tr')
    const noUrut = (currentPage - 1) * limit + (index + 1)
    const formattedDate = formatTanggal(item.created_at)

    // MAPPING DATA KE HTML (Pastikan urutan sesuai Header HTML)
    tr.innerHTML = `
        <td style="text-align:center;">${noUrut}</td>
        
        <td>${formatTanggal(item.tanggal || item.created_at)}</td>
        
        <td>${item.employee_id || item.user_id || item.nik || '-'}</td>
        
        <td>${item.departement || item.department || '-'}</td>
        
        <td>${item.section || '-'}</td>
        
        <td>${item.position || item.jabatan || '-'}</td>
        
        <td style="white-space:normal; line-height:1.4;">${item.alasan || '-'}</td>
        
        <td class="status">
            <span class="${getStatusClass(item.status)}">${item.status}</span>
        </td>
        
        <td style="text-align:center;"><input type="checkbox" class="centang"></td>
        <td style="text-align:center;">
            <a href="#" class="edit"><i class="fa-regular fa-pen-to-square"></i></a>
            <button type="button" class="hapus" disabled><i class="fa-regular fa-trash-can"></i></button>
        </td>
    `

    // Pasang Event Listener per baris (Edit & Delete)
    attachRowEvents(tr, item)
    tbody.appendChild(tr)
  })
}

function attachRowEvents (row, item) {
  const checkbox = row.querySelector('.centang')
  const deleteBtn = row.querySelector('.hapus')
  const editBtn = row.querySelector('.edit')

  // Checkbox Logic
  checkbox.addEventListener('change', () => {
    deleteBtn.disabled = !checkbox.checked
  })

  // Delete Logic
  deleteBtn.addEventListener('click', async () => {
    if (!confirm('Yakin ingin menghapus data ini?')) return
    try {
      const res = await fetch(`http://localhost:3000/api/izin/log/${item.id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        showAlert(modalDeleteSuccess)
        loadFromApi(currentPage)
      }
    } catch (err) {
      console.error(err)
    }
  })

  // Edit Logic
  editBtn.addEventListener('click', (e) => {
    e.preventDefault()
    currentEditingId = item.id
    console.log(currentEditingId)
    // Isi Form
    editName.value = item.user_id || item.nama_karyawan || ''
    editReason.value = item.alasan || ''
    editStatus.value = item.status || ''

    modalEdit.style.display = 'block'
  })
}

// ============================================================================
// 5. LOGIC EDIT DATA
// ============================================================================
async function handleSaveEdit () {
  if (!currentEditingId) return alert('ID tidak ditemukan!')
  if (!editStatus.value) return alert('Pilih status dulu!')

  // --- PERBAIKAN DI SINI ---
  // JANGAN kirim user_id atau editName.value!
  // Biarkan ID tetap sama, kita cuma mau ubah status & alasan.
  const updateData = {
    status: editStatus.value
  }

  console.log('Kirim Data:', updateData)

  try {
    const response = await fetch(`http://localhost:3000/api/izin/log/update/${currentEditingId}`, {
      method: 'PUT', // Pastikan backend lo pakai PUT
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    })

    const result = await response.json()

    if (response.ok) {
      alert('Berhasil Update!')
      document.getElementById('modalEdit').style.display = 'none'
      loadFromApi(currentPage) // Refresh tabel
    } else {
      // Ini biar kita tau errornya apa
      alert('Gagal: ' + (result.message || result.errorDetail || 'Cek Console'))
      console.error(result)
    }
  } catch (err) {
    console.error(err)
  }
}

function resetForm () {
  editName.value = ''
  editReason.value = ''
  editStatus.selectedIndex = 0
  currentEditingId = null
}

// ============================================================================
// 6. HELPER FUNCTIONS (Status, Tanggal, Pagination)
// ============================================================================
function updateStatusCounters () {
  let pending = 0
  let approved = 0
  let rejected = 0

  // Hitung manual dari DOM (atau lebih baik ambil dari API count terpisah)
  document.querySelectorAll('td.status span').forEach((span) => {
    const txt = span.textContent.toLowerCase()
    if (txt.includes('menunggu') || txt.includes('pending')) pending++
    else if (txt.includes('setuju') || txt.includes('approved')) approved++
    else if (txt.includes('tolak') || txt.includes('rejected')) rejected++
  })

  pendingCount.textContent = pending
  approvedCount.textContent = approved
  rejectedCount.textContent = rejected
}

function getStatusClass (status) {
  if (!status) return ''
  const s = status.toLowerCase()
  if (s.includes('setuju') || s.includes('approved')) return 'status-approved'
  if (s.includes('tolak') || s.includes('rejected')) return 'status-rejected'
  return 'status-pending'
}

function formatTanggal (dateString) {
  if (!dateString) return '-'
  const date = new Date(dateString)
  if (isNaN(date)) return '-'

  // Format: DD-MM-YYYY HH:mm
  return date
    .toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
    .replace(/\//g, '-')
    .replace(',', ' ')
}

function showAlert (element) {
  element.style.display = 'block'
  setTimeout(() => {
    element.style.display = 'none'
  }, 3000)
}

// ============================================================================
// 7. PAGINATION CONTROL
// ============================================================================
function updatePagination (paginationData) {
  const { total_pages, current_page, next, prev } = paginationData

  pageInfo.innerHTML = ''
  const total = total_pages || 1

  // Render Angka Halaman
  for (let i = 1; i <= total; i++) {
    const btn = document.createElement('button')
    btn.textContent = i
    btn.className = i === current_page ? 'act-pgn' : '' // Pastikan ada CSS .act-pgn

    // PENTING: Gunakan Arrow Function agar parameter i terkirim
    btn.onclick = () => loadFromApi(i)

    pageInfo.appendChild(btn)
  }

  // Tombol Next/Prev
  prevBtn.disabled = !prev
  prevBtn.onclick = () => {
    if (prev) loadFromApi(prev.page)
  }

  nextBtn.disabled = !next
  nextBtn.onclick = () => {
    if (next) loadFromApi(next.page)
  }
}

// ============================================================================
// 8. KPI / STATUS MODAL LOGIC (Top Dashboard)
// ============================================================================
const statusConfig = {
  pending: { end: 'pending', cls: 'status-pending' },
  approved: { end: 'approved', cls: 'status-approved' },
  rejected: { end: 'rejected', cls: 'status-rejected' }
}

async function handleLogStatus (typeStatus) {
  try {
    const cfg = statusConfig[typeStatus]
    const res = await fetch(`http://localhost:3000/api/izin/log/${cfg.end}`)
    const result = await res.json()

    if (!res.ok) throw new Error(result.message)

    showStatusModal(result.message, result.data)
  } catch (err) {
    alert('Gagal memuat detail status: ' + err.message)
  }
}

function showStatusModal (message, data = []) {
  const modalSts = document.getElementById('modalSts')
  const modalMsg = document.getElementById('modal-message')
  const modalTable = document.getElementById('modal-table')
  const closeBtn = document.getElementById('close-modal')

  modalMsg.textContent = message
  modalTable.innerHTML = '' // Clear old table

  if (data.length === 0) {
    modalTable.textContent = 'Tidak ada data.'
  } else {
    // Buat Tabel Simpel
    let html = '<table class="table" style="width:100%"><thead><tr><th>NIK</th><th>Alasan</th><th>Tanggal</th></tr></thead><tbody>'
    data.forEach((item) => {
      html += `<tr>
                <td>${item.user_id || item.nik}</td>
                <td>${item.alasan}</td>
                <td>${formatTanggal(item.created_at)}</td>
            </tr>`
    })
    html += '</tbody></table>'
    modalTable.innerHTML = html
  }

  modalSts.style.display = 'flex' // Show modal
  modalSts.classList.remove('hidden')

  closeBtn.onclick = () => {
    modalSts.style.display = 'none'
  }
}
