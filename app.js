const taskInput = document.querySelector('#task-input');
const addTaskButton = document.querySelector('#add-task');
const taskList = document.querySelector('#task-list');
const progress = document.querySelector('#progress');

const tasks = [
  { text: 'Create a shared repository', done: true },
  { text: 'Invite a collaborator', done: false },
  { text: 'Open the first pull request', done: false },
];

function render() {
  taskList.replaceChildren();
  tasks.forEach((task, index) => {
    const item = document.createElement('li');
    item.classList.toggle('done', task.done);

    const toggle = document.createElement('button');
    toggle.className = 'toggle';
    toggle.setAttribute('aria-label', `Toggle completion status for “${task.text}”`);
    toggle.addEventListener('click', () => {
      task.done = !task.done;
      render();
    });

    const label = document.createElement('span');
    label.textContent = task.text;
    item.append(toggle, label);
    taskList.append(item);
  });

  progress.textContent = `${tasks.filter(task => task.done).length} / ${tasks.length} complete`;
}

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;
  tasks.push({ text, done: false });
  taskInput.value = '';
  render();
  taskInput.focus();
}

addTaskButton.addEventListener('click', addTask);
taskInput.addEventListener('keydown', event => {
  if (event.key === 'Enter') addTask();
});

render();
