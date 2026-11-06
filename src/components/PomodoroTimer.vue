<template>
  <div class="pomodoro" :class="mode">
    <div class="time-row">
      <span class="mode-label">{{ modeLabel }}</span>
      <span class="time">{{ formattedTime }}</span>
    </div>
    <p class="task">{{ taskLabel }}</p>
    <div class="durations">
      <label>
        Work
        <input
          type="number"
          min="1"
          step="1"
          v-model.number="workMinutes"
          :disabled="inputsLocked"
          @change="onWorkMinutesChange"
        />
      </label>
      <label>
        Rest
        <input
          type="number"
          min="1"
          step="1"
          v-model.number="restMinutes"
          :disabled="inputsLocked"
          @change="onRestMinutesChange"
        />
      </label>
    </div>
    <div class="controls">
      <button type="button" :disabled="primaryDisabled" @click="toggleRunning">
        {{ primaryLabel }}
      </button>
      <button type="button" :disabled="mode === 'stopped'" @click="reset">Reset</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from "vue";
import moment from "moment";
import { usePlanningStore } from "@/store/planning";

type Mode = "stopped" | "work" | "rest";

const planningStore = usePlanningStore();

const mode = ref<Mode>("stopped");
const paused = ref(false);
const workMinutes = ref(25);
const restMinutes = ref(5);
const remainingSeconds = ref(25 * 60);

let intervalId: ReturnType<typeof setInterval> | null = null;
let endsAt: number | null = null;
let finishing = false;

const inputsLocked = computed(() => mode.value !== "stopped");
const primaryDisabled = computed(() => mode.value === "stopped" && !planningStore.pomodoroCard);
const primaryLabel = computed(() => {
  if (mode.value === "stopped") return "Start";
  return paused.value ? "Resume" : "Pause";
});
const modeLabel = computed(() => {
  if (mode.value === "work") return "Work";
  if (mode.value === "rest") return "Rest";
  return "Ready";
});
const taskLabel = computed(() => {
  if (!planningStore.pomodoroCard) return "Flag a card to choose the current task";
  return planningStore.pomodoroCard.title;
});
const formattedTime = computed(() => {
  const minutes = Math.floor(remainingSeconds.value / 60);
  const seconds = remainingSeconds.value % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
});

function clampMinutes(value: number) {
  if (!Number.isFinite(value) || value < 1) return 1;
  return Math.floor(value);
}

function clearTick() {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

function syncLock() {
  planningStore.pomodoroLocked = mode.value !== "stopped";
}

function startTicking() {
  clearTick();
  paused.value = false;
  endsAt = Date.now() + remainingSeconds.value * 1000;
  intervalId = setInterval(tick, 1000);
  tick();
}

function tick() {
  if (mode.value === "stopped" || paused.value || endsAt === null || finishing) return;
  const remainingMs = endsAt - Date.now();
  if (remainingMs > 0) {
    remainingSeconds.value = Math.ceil(remainingMs / 1000);
    return;
  }
  remainingSeconds.value = 0;
  if (mode.value === "work") {
    void finishWork();
    return;
  }
  finishRest();
}

async function finishWork() {
  if (finishing || mode.value !== "work") return;
  finishing = true;
  try {
    const workEndedAt = endsAt ?? Date.now();
    const card = planningStore.pomodoroCard;
    const finishedAt = moment(workEndedAt).format("MMM DD, YYYY h:mm A");
    const restMs = clampMinutes(restMinutes.value) * 60 * 1000;
    const restEndsAt = workEndedAt + restMs;
    mode.value = "rest";
    endsAt = restEndsAt;
    syncLock();
    if (Date.now() >= restEndsAt) {
      finishRest();
    } else {
      remainingSeconds.value = Math.ceil((restEndsAt - Date.now()) / 1000);
    }
    finishing = false;
    if (!card) return;
    await planningStore.createComment({
      newComment: {
        card: card._id,
        content: `You have worked 1 pomodoro at ${finishedAt}`,
        createdOn: new Date(workEndedAt),
        _id: "0",
        createdBy: planningStore.myUser,
      },
      board: card.board,
    });
  } finally {
    finishing = false;
  }
}

function finishRest() {
  clearTick();
  endsAt = null;
  mode.value = "stopped";
  paused.value = false;
  remainingSeconds.value = clampMinutes(workMinutes.value) * 60;
  syncLock();
}

function pause() {
  if (endsAt !== null && endsAt - Date.now() <= 0) {
    tick();
    return;
  }
  if (endsAt !== null) {
    remainingSeconds.value = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
  }
  clearTick();
  endsAt = null;
  paused.value = true;
}

function toggleRunning() {
  if (mode.value === "stopped") {
    if (!planningStore.pomodoroCard) return;
    workMinutes.value = clampMinutes(workMinutes.value);
    mode.value = "work";
    remainingSeconds.value = workMinutes.value * 60;
    syncLock();
    startTicking();
    return;
  }
  if (paused.value) {
    startTicking();
    return;
  }
  pause();
}

function reset() {
  clearTick();
  endsAt = null;
  finishing = false;
  mode.value = "stopped";
  paused.value = false;
  remainingSeconds.value = clampMinutes(workMinutes.value) * 60;
  syncLock();
}

function catchUp() {
  if (mode.value === "stopped" || paused.value || endsAt === null) return;
  tick();
}

function onVisibilityChange() {
  if (document.visibilityState === "visible") catchUp();
}

document.addEventListener("visibilitychange", onVisibilityChange);
window.addEventListener("focus", catchUp);

function onWorkMinutesChange() {
  workMinutes.value = clampMinutes(workMinutes.value);
  if (mode.value === "stopped") {
    remainingSeconds.value = workMinutes.value * 60;
  }
}

function onRestMinutesChange() {
  restMinutes.value = clampMinutes(restMinutes.value);
}

watch(
  () => planningStore.selectedProjectId,
  (projectId, previousId) => {
    if (previousId === undefined || projectId === previousId) return;
    reset();
    planningStore.pomodoroCardId = null;
    planningStore.pomodoroCardBoardId = null;
  },
);

onUnmounted(() => {
  clearTick();
  document.removeEventListener("visibilitychange", onVisibilityChange);
  window.removeEventListener("focus", catchUp);
  planningStore.pomodoroLocked = false;
});
</script>

<style scoped>
.pomodoro {
  position: fixed;
  right: 1.5rem;
  bottom: 1.5rem;
  z-index: 5;
  width: 280px;
  padding: 1rem;
  border-radius: 15px;
  box-shadow: 3px 3px 12px var(--color-shadow-strong);
  text-align: left;
}

.pomodoro.stopped {
  background-color: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.pomodoro.work {
  background-color: var(--color-accent);
  color: var(--color-on-accent);
}

.pomodoro.rest {
  background-color: var(--color-success);
  color: var(--color-on-success);
}

.time-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem;
}

.mode-label {
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  font-size: 0.85rem;
}

.time {
  font-size: 2.5rem;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.task {
  margin: 0.75rem 0;
  min-height: 2.5em;
}

.durations {
  display: flex;
  gap: 0.75rem;
}

.durations label {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: 0.85rem;
  flex: 1;
}

.durations input {
  width: 100%;
  margin: 0.35rem 0 0;
  box-sizing: border-box;
  color: var(--color-text);
  background-color: var(--color-surface);
}

.controls {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.85rem;
}

.controls button {
  flex: 1;
  border: 0;
  border-radius: 5px;
  padding: 0.5em;
  background-color: var(--color-surface);
  color: var(--color-text);
  cursor: pointer;
}

.controls button:disabled {
  opacity: 0.55;
  cursor: default;
}

.controls button:not(:disabled):hover {
  color: var(--color-accent);
}
</style>
