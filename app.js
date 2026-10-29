const taskInput = document.querySelector('#task-input');
const addTaskButton = document.querySelector('#add-task');
const taskList = document.querySelector('#task-list');
const progress = document.querySelector('#progress');
const storageKey = 'collaboration-board-tasks';
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const starterTasks = [
  { text: 'Create a shared repository', done: true },
  { text: 'Invite a collaborator', done: false },
  { text: 'Open the first pull request', done: false },
];
let tasks = loadTasks();
let isCelebrating = false;

if (new URLSearchParams(window.location.search).has('clear-completed')) {
  tasks = tasks.filter(task => !task.done);
  saveTasks();
  window.history.replaceState({}, '', window.location.pathname);
}

function loadTasks() {
  try {
    const savedTasks = JSON.parse(sessionStorage.getItem(storageKey));
    if (Array.isArray(savedTasks)) return savedTasks;
  } catch {
    // Use the starter tasks when saved browser data is unavailable or invalid.
  }

  return starterTasks.map(task => ({ ...task }));
}

function saveTasks() {
  sessionStorage.setItem(storageKey, JSON.stringify(tasks));
}

function allTasksComplete() {
  return tasks.length > 0 && tasks.every(task => task.done);
}

function render() {
  taskList.replaceChildren();
  tasks.forEach((task, index) => {
    const item = document.createElement('li');
    item.classList.toggle('done', task.done);

    const toggle = document.createElement('button');
    toggle.className = 'toggle';
    toggle.setAttribute('aria-label', `Toggle completion status for “${task.text}”`);
    toggle.addEventListener('click', () => {
      const wasComplete = allTasksComplete();
      task.done = !task.done;
      render();
      if (!wasComplete && allTasksComplete()) celebrateCompletion();
    });

    const label = document.createElement('span');
    label.className = 'task-label';
    label.textContent = task.text;

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-task';
    deleteButton.type = 'button';
    deleteButton.setAttribute('aria-label', `Delete “${task.text}”`);
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
      tasks.splice(index, 1);
      render();
    });

    item.append(toggle, label, deleteButton);
    taskList.append(item);
  });

  progress.textContent = `${tasks.filter(task => task.done).length} / ${tasks.length} complete`;
  saveTasks();
}

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;
  tasks.push({ text, done: false });
  taskInput.value = '';
  render();
  taskInput.focus();
}

function celebrateCompletion() {
  if (isCelebrating) return;
  isCelebrating = true;

  if (prefersReducedMotion) {
    window.location.assign('complete.html');
    return;
  }

  const confetti = document.createElement('div');
  confetti.className = 'confetti-layer';
  confetti.setAttribute('aria-hidden', 'true');

  const colors = ['#545bd8', '#f59e0b', '#ec4899', '#42a56b', '#38bdf8'];
  for (let index = 0; index < 90; index += 1) {
    const piece = document.createElement('span');
    piece.className = 'confetti-piece';
    piece.style.setProperty('--x', `${Math.random() * 100}vw`);
    piece.style.setProperty('--delay', `${Math.random() * 0.45}s`);
    piece.style.setProperty('--rotation', `${Math.random() * 360}deg`);
    piece.style.backgroundColor = colors[index % colors.length];
    confetti.append(piece);
  }

  document.body.append(confetti);
  window.setTimeout(() => window.location.assign('complete.html'), 2000);
}

addTaskButton.addEventListener('click', addTask);
taskInput.addEventListener('keydown', event => {
  if (event.key === 'Enter') addTask();
});

render();
