// 5. dateUtils.js (Enhanced)

export const generateTimeSlots = (startTime, endTime, intervalMinutes = 30) => {
    const slots = [];
    const start = new Date(`2000-01-01 ${startTime}`);
    const end = new Date(`2000-01-01 ${endTime}`);
    
    let current = start;
    while (current < end) {
        const hours = current.getHours();
        const minutes = current.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12;
        const formattedMinutes = minutes.toString().padStart(2, '0');
        
        slots.push(`${formattedHours}:${formattedMinutes} ${ampm}`);
        current.setMinutes(current.getMinutes() + intervalMinutes);
    }
    
    return slots;
};

export const getAvailableDates = (availableDays, daysToShow = 14) => {
    const dates = [];
    const today = new Date();
    const dayMap = {
        'Sunday': 0,
        'Monday': 1,
        'Tuesday': 2,
        'Wednesday': 3,
        'Thursday': 4,
        'Friday': 5,
        'Saturday': 6
    };
    
    const availableDayIndices = availableDays.map(day => dayMap[day]);
    
    for (let i = 0; i < daysToShow; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dayOfWeek = date.getDay();
        
        if (availableDayIndices.includes(dayOfWeek)) {
            dates.push(formatDateAPI(date));
        }
    }
    
    return dates;
};

export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

export const formatDateAPI = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const isUpcoming = (dateString) => {
    const today = new Date().toISOString().split('T')[0];
    return dateString >= today;
};

export const getDayName = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
};