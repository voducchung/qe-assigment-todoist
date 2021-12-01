/**
 * Caculate the expected due date from the input
 * @param {string} dueDate
 * @returns the expected due date
 */
function calculateExpectedDueDate(dueDate) {
    if (dueDate.toLowerCase() === 'today') return 'Today'
    if (dueDate.toLowerCase() === 'tomorrow') return 'Tomorrow'
    if (dueDate.toLowerCase() === 'next weekend' || dueDate.toLowerCase() === 'this weekend') return 'Saturday'
}

export { calculateExpectedDueDate }
