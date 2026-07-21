// SUPABASE_URL / SUPABASE_ANON_KEY는 config.js에서 로드됨 (index.html에서 config.js를
// 이 스크립트보다 먼저 불러옴). anon key는 브라우저에 노출되어도 되는 공개 키이며,
// 실제 데이터 접근 제어는 schema.sql의 RLS 정책이 담당한다.
const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const form = document.getElementById("entry-form");
const nameInput = document.getElementById("name");
const messageInput = document.getElementById("message");
const submitBtn = document.getElementById("submit-btn");
const statusEl = document.getElementById("status");
const listEl = document.getElementById("entries");
const emptyEl = document.getElementById("empty");

function setStatus(text, isError = false) {
  statusEl.textContent = text;
  statusEl.classList.toggle("error", isError);
}

// 사용자가 입력한 name/message를 renderEntries()에서 innerHTML로 삽입하기 때문에,
// <script> 등이 그대로 실행되는 XSS를 막기 위해 반드시 이 함수를 거쳐 이스케이프한다.
// (div.textContent에 대입 후 innerHTML을 읽으면 브라우저가 특수문자를 엔티티로 변환해준다)
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function renderEntries(entries) {
  listEl.innerHTML = "";
  emptyEl.style.display = entries.length === 0 ? "block" : "none";

  for (const entry of entries) {
    const li = document.createElement("li");
    const created = new Date(entry.created_at).toLocaleString("ko-KR");
    li.innerHTML = `
      <div class="entry-body">
        <strong>${escapeHtml(entry.name)}</strong>
        <p>${escapeHtml(entry.message)}</p>
        <time>${created}</time>
      </div>
      <button class="delete-btn" data-id="${entry.id}">삭제</button>
    `;
    listEl.appendChild(li);
  }
}

async function loadEntries() {
  setStatus("불러오는 중...");
  const { data, error } = await client
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    setStatus("불러오기 실패: " + error.message, true);
    return;
  }
  setStatus("");
  renderEntries(data);
}

async function addEntry(name, message) {
  const { error } = await client.from("messages").insert({ name, message });
  if (error) {
    setStatus("저장 실패: " + error.message, true);
    return false;
  }
  return true;
}

// 개선 포인트: 항목 삭제 기능 (튜토리얼 기본 방명록에는 없는 기능을 추가함)
async function deleteEntry(id) {
  const { error } = await client.from("messages").delete().eq("id", id);
  if (error) {
    setStatus("삭제 실패: " + error.message, true);
    return;
  }
  await loadEntries();
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();
  const message = messageInput.value.trim();
  if (!name || !message) return;

  submitBtn.disabled = true;
  setStatus("저장 중...");
  const ok = await addEntry(name, message);
  submitBtn.disabled = false;

  if (ok) {
    nameInput.value = "";
    messageInput.value = "";
    setStatus("저장되었습니다.");
    await loadEntries();
  }
});

// renderEntries()가 목록을 통째로 다시 그리므로, 항목마다 리스너를 새로 달지 않고
// 부모(listEl)에 한 번만 위임해서 재렌더링 후에도 계속 동작하게 한다.
listEl.addEventListener("click", (e) => {
  const btn = e.target.closest(".delete-btn");
  if (!btn) return;
  deleteEntry(btn.dataset.id);
});

loadEntries();
