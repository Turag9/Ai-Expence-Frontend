import { useEffect, useMemo, useState } from 'react';
import {
    Sparkles,
    TrendingUp,
    Lightbulb,
    Activity,
    Wallet,
    Clock,
    ArrowRight,
    BarChart2,
    PieChart,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/axios.js';
import { API_PATHS } from '../utils/apiPaths.js';
import { timeAgo } from '../utils/format.js';
import EmptyState from '../components/EmptyState.jsx';
import Spinner from '../components/Spinner.jsx';
import InsightCard from '../components/InsightCard.jsx';
import KpiCard from '../components/KpiCard.jsx';

const ActionCard = ({ title, description, icon: Icon, accentGradient, accentText, onClick, generating, lastGenerated }) => (
    <button
        onClick={onClick}
        disabled={generating}
        className="group relative overflow-hidden bg-white rounded-3xl border border-slate-100 p-6 text-left hover:border-slate-200 hover:shadow-md transition disabled:opacity-60 disabled:cursor-not-allowed"
    >
        <div className="flex items-start justify-between mb-4">
            <div className={`h-14 w-14 rounded-2xl bg-linear-to-br ${accentGradient} flex items-center justify-center group-hover:scale-105 transition shadow-sm`}>
                <Icon size={24} className="text-white" />
            </div>
            {generating ? (
                <Spinner size="sm" />
            ) : (
                <Sparkles size={16} className="text-slate-300 group-hover:text-teal-600 transition" />
            )}
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-1.5">{title}</h3>
        <p className="text-sm text-slate-500 mb-5 leading-relaxed">{description}</p>
        <div className="flex items-center justify-between">
            <span className={`inline-flex items-center gap-1.5 text-sm font-semibold ${accentText}`}>
                {generating ? 'Analyzing...' : 'Generate Insight'}
                {!generating && <ArrowRight size={14} className="group-hover:translate-x-0.5 transition" />}
            </span>
            {lastGenerated && (
                <span className="text-xs text-slate-400">Last: {timeAgo(lastGenerated)}</span>
            )}
        </div>
    </button>
);

const Insights = () => {
    const [insights, setInsights] = useState([]);
    const [loading, setLoading] = useState(true);
    // generating tracks which insight type is being fetched: null | 'monthly' | 'savings_tips' | 'analyze_transactions' | 'analyze_budgets'
    const [generating, setGenerating] = useState(null);

    const fetchInsights = async () => {
        try {
            setLoading(true);
            // GET /api/insights/history — returns past saved insights
            const res = await api.get(API_PATHS.INSIGHTS.HISTORY);
            setInsights(res.data);
        } catch (err) {
            toast.error('Failed to load insights');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInsights();
    }, []);

    /**
     * Map of insight "type key" → backend endpoint.
     * Backend returns the insight and also persists it to ai_insights table.
     * After fetching, we refresh the history list.
     */
    const INSIGHT_ENDPOINTS = {
        monthly: API_PATHS.INSIGHTS.MONTHLY,
        savings_tips: API_PATHS.INSIGHTS.SAVINGS_TIPS,
        analyze_transactions: API_PATHS.INSIGHTS.ANALYZE_TRANSACTIONS,
        analyze_budgets: API_PATHS.INSIGHTS.ANALYZE_BUDGETS,
    };

    const generate = async (type) => {
        setGenerating(type);
        try {
            await api.get(INSIGHT_ENDPOINTS[type]);
            toast.success('Insight generated!');
            fetchInsights();
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to generate insight';
            toast.error(msg);
        } finally {
            setGenerating(null);
        }
    };

    const stats = useMemo(() => {
        // Backend stores insight_type as: 'monthly_insight', 'savings_tips', 'transaction_analysis', 'budget_analysis'
        const latestMonthly = insights.find((i) => i.insight_type === 'monthly_insight');
        const latestTips = insights.find((i) => i.insight_type === 'savings_tips');
        const monthly = latestMonthly?.content_json;
        const tips = latestTips?.content_json;
        const potentialSavings =
            tips?.tips?.reduce((sum, t) => sum + (Number(t.estimatedSavings) || 0), 0) || 0;

        return {
            total: insights.length,
            healthScore: monthly?.healthScore ?? null,
            potentialSavings,
            lastAt: insights[0]?.created_at || null,
            latestMonthlyAt: latestMonthly?.created_at,
            latestTipsAt: latestTips?.created_at,
        };
    }, [insights]);

    const healthAccent =
        stats.healthScore == null
            ? 'slate'
            : stats.healthScore >= 70
            ? 'emerald'
            : stats.healthScore >= 40
            ? 'amber'
            : 'rose';

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">AI Insights</h1>
                <p className="text-sm text-slate-500 mt-1.5">
                    Personalized financial analysis powered by Gemini — generate insights and watch your money smarter
                </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard
                    label="Insights generated"
                    value={stats.total}
                    icon={Sparkles}
                    accent="blue"
                />
                <KpiCard
                    label="Health score"
                    value={stats.healthScore != null ? `${stats.healthScore}/100` : '—'}
                    icon={Activity}
                    accent={healthAccent}
                />
                <KpiCard
                    label="Potential savings"
                    value={stats.potentialSavings > 0 ? `$${stats.potentialSavings.toFixed(0)}/mo` : '—'}
                    icon={Wallet}
                    accent="orange"
                />
                <KpiCard
                    label="Last analysis"
                    value={stats.lastAt ? timeAgo(stats.lastAt) : '—'}
                    icon={Clock}
                    accent="blue"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ActionCard
                    title="Monthly Summary"
                    description="A full breakdown of this month's income, expenses, and a personalized health score with actionable recommendations."
                    icon={TrendingUp}
                    accentGradient="from-blue-700 to-teal-500"
                    accentText="text-teal-600"
                    onClick={() => generate('monthly')}
                    generating={generating === 'monthly'}
                    lastGenerated={stats.latestMonthlyAt}
                />
                <ActionCard
                    title="Savings Tips"
                    description="Tailored, ranked ways to save money based on your top spending categories from the last 30 days."
                    icon={Lightbulb}
                    accentGradient="from-blue-400 to-blue-600"
                    accentText="text-blue-600"
                    onClick={() => generate('savings_tips')}
                    generating={generating === 'savings_tips'}
                    lastGenerated={stats.latestTipsAt}
                />
                <ActionCard
                    title="Analyze Transactions"
                    description="AI-powered analysis of your recent 50 transactions — patterns, anomalies, and spending habits."
                    icon={BarChart2}
                    accentGradient="from-emerald-400 to-emerald-600"
                    accentText="text-emerald-600"
                    onClick={() => generate('analyze_transactions')}
                    generating={generating === 'analyze_transactions'}
                    lastGenerated={null}
                />
                <ActionCard
                    title="Analyze Budgets"
                    description="Get a detailed performance review of all your budgets — which ones are on track and which need attention."
                    icon={PieChart}
                    accentGradient="from-rose-400 to-rose-600"
                    accentText="text-rose-600"
                    onClick={() => generate('analyze_budgets')}
                    generating={generating === 'analyze_budgets'}
                    lastGenerated={null}
                />
            </div>

            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-slate-900 tracking-tight">Recent Analyses</h2>
                    {!loading && insights.length > 0 && (
                        <span className="text-xs text-slate-500">
                            {insights.length} {insights.length === 1 ? 'analysis' : 'analyses'}
                        </span>
                    )}
                </div>

                {loading ? (
                    <div className="bg-white rounded-3xl border border-slate-100 py-16 flex justify-center">
                        <Spinner size="lg" />
                    </div>
                ) : insights.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-slate-100">
                        <EmptyState
                            icon={Sparkles}
                            title="No insights yet"
                            description="Generate your first AI analysis using one of the cards above."
                        />
                    </div>
                ) : (
                    <div className="space-y-3">
                        {insights.map((i, idx) => (
                            <InsightCard
                                key={i.id}
                                insight={i}
                                defaultExpanded={idx === 0}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Insights;
