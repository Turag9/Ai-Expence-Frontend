export const API_PATHS = {
    AUTH: {
        REGISTER: '/auth/register',
        LOGIN: '/auth/login',
        ME: '/auth/me',
    },
    CATEGORIES: {
        LIST: '/categories',
        CREATE: '/categories',
        UPDATE: (id) => `/categories/${id}`,
        DELETE: (id) => `/categories/${id}`,
    },
    TRANSACTIONS: {
        LIST: '/transactions',
        CREATE: '/transactions',
        GET_BY_ID: (id) => `/transactions/${id}`,
        UPDATE: (id) => `/transactions/${id}`,
        DELETE: (id) => `/transactions/${id}`,
        ANALYZE: '/transactions/analyze',
    },
    BUDGETS: {
        LIST: '/budgets',
        CREATE: '/budgets',
        UPDATE: (id) => `/budgets/${id}`,
        DELETE: (id) => `/budgets/${id}`,
        ANALYZE: '/budgets/analyze',
        ALERT: (id) => `/insights/budget-alert/${id}`,
    },
    DASHBOARD: {
        SUMMARY: '/dashboard/summary',
        CATEGORY_BREAKDOWN: '/dashboard/category-breakdown',
        MONTHLY_TREND: '/dashboard/monthly-trend',
    },
    INSIGHTS: {
        // Fetch history of all past insights
        HISTORY: '/insights/history',
        // Individual insight generators (all GET)
        MONTHLY: '/insights/monthly',
        SAVINGS_TIPS: '/insights/savings-tips',
        ANALYZE_TRANSACTIONS: '/insights/analyze-transactions',
        ANALYZE_BUDGETS: '/insights/analyze-budgets',
    },
};

export default API_PATHS;
