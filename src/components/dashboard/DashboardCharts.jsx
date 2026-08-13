    import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

    export default function DashboardCharts({ tasks }) {
    // Güvenlik kontrolü
    const safeTasks = Array.isArray(tasks) ? tasks : [];

    // 1. Priority Bazında Task Dağılımı
    const priorityData = [
        { name: 'High', value: safeTasks.filter(t => t.priority === 'High').length },
        { name: 'Medium', value: safeTasks.filter(t => t.priority === 'Medium').length },
        { name: 'Low', value: safeTasks.filter(t => t.priority === 'Low').length },
    ].filter(item => item.value > 0);

    const priorityColors = ['#ef4444', '#f59e0b', '#22c55e'];

    // 2. Durum Bazında Task Dağılımı - Detaylı hesaplama ile
    const getStatusData = () => {
        // Tüm task'ları analiz et
        let completed = 0;
        let inProgress = 0;
        let notStarted = 0;
        
        // Completed task'lar için detaylı analiz
        let earlyCompleted = 0;
        let lateCompleted = 0;
        let onTimeCompleted = 0;
        
        safeTasks.forEach(task => {
        if (task.finishDate && task.dueDate) {
            // Tamamlanmış task
            completed++;
            
            const due = new Date(`${task.dueDate}T00:00:00`);
            const finish = new Date(`${task.finishDate}T00:00:00`);
            const diff = Math.round((finish - due) / (1000 * 60 * 60 * 24));
            
            if (diff < 0) {
            earlyCompleted++; // Erken tamamlanmış
            } else if (diff > 0) {
            lateCompleted++; // Geç tamamlanmış
            } else {
            onTimeCompleted++; // Tam zamanında
            }
        } else if (!task.finishDate && task.miniTasks && task.miniTasks.length > 0) {
            inProgress++;
        } else if (!task.finishDate) {
            notStarted++;
        }
        });
        
        return {
        statusData: [
            { 
            name: 'Completed', 
            value: completed,
            early: earlyCompleted,
            late: lateCompleted,
            onTime: onTimeCompleted,
            total: completed
            },
            { 
            name: 'In Progress', 
            value: inProgress 
            },
            { 
            name: 'Not Started', 
            value: notStarted 
            },
        ].filter(item => item.value > 0),
        earlyCompleted,
        lateCompleted,
        onTimeCompleted,
        totalCompleted: completed
        };
    };

    const { statusData, earlyCompleted, lateCompleted, onTimeCompleted, totalCompleted } = getStatusData();
    const statusColors = ['#22c55e', '#f59e0b', '#94a3b8'];

    // 3. Sorumlu Kişi (Responsible Person) Bazında Task Dağılımı
    const responsibleMap = {};
    safeTasks.forEach(task => {
        const person = task.responsiblePerson || 'Unassigned';
        if (!responsibleMap[person]) {
        responsibleMap[person] = {
            total: 0,
            completed: 0,
            inProgress: 0,
            notStarted: 0
        };
        }
        responsibleMap[person].total += 1;
        
        if (task.finishDate) {
        responsibleMap[person].completed += 1;
        } else if (task.miniTasks && task.miniTasks.length > 0) {
        responsibleMap[person].inProgress += 1;
        } else {
        responsibleMap[person].notStarted += 1;
        }
    });

    const responsibleData = Object.entries(responsibleMap)
        .map(([name, stats]) => ({ 
        name, 
        value: stats.total,
        completed: stats.completed,
        inProgress: stats.inProgress,
        notStarted: stats.notStarted
        }))
        .sort((a, b) => b.value - a.value);

    // 4. Atanan Kişi (Assigned To) Bazında Task Dağılımı
    const assignedMap = {};
    safeTasks.forEach(task => {
        const person = task.assignedTo || 'Unassigned';
        if (!assignedMap[person]) {
        assignedMap[person] = {
            total: 0,
            completed: 0,
            inProgress: 0,
            notStarted: 0
        };
        }
        assignedMap[person].total += 1;
        
        if (task.finishDate) {
        assignedMap[person].completed += 1;
        } else if (task.miniTasks && task.miniTasks.length > 0) {
        assignedMap[person].inProgress += 1;
        } else {
        assignedMap[person].notStarted += 1;
        }
    });

    const assignedData = Object.entries(assignedMap)
        .map(([name, stats]) => ({ 
        name, 
        value: stats.total,
        completed: stats.completed,
        inProgress: stats.inProgress,
        notStarted: stats.notStarted
        }))
        .sort((a, b) => b.value - a.value);

    // Renk paleti
    const colorPalette = [
        '#8b5cf6', '#ec4899', '#06b6d4', '#f97316', '#6366f1',
        '#14b8a6', '#d946ef', '#f43f5e', '#0ea5e9', '#84cc16',
        '#8b5cf6', '#f59e0b', '#22c55e', '#ef4444', '#3b82f6',
    ];

    // ============================================
    // ÖZEL TOOLTIP - Status chart için (Completed detaylı)
    // ============================================
    const StatusTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
        const data = payload[0].payload;
        
        // Eğer Completed ise detaylı göster
        if (data.name === 'Completed' && data.early !== undefined) {
            const total = data.value || 0;
            const early = data.early || 0;
            const late = data.late || 0;
            const onTime = data.onTime || 0;
            
            const earlyPercent = total > 0 ? ((early / total) * 100).toFixed(1) : 0;
            const latePercent = total > 0 ? ((late / total) * 100).toFixed(1) : 0;
            const onTimePercent = total > 0 ? ((onTime / total) * 100).toFixed(1) : 0;
            
            return (
            <div style={{
                backgroundColor: '#ffffff',
                padding: '16px 20px',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                minWidth: '200px',
                maxWidth: '280px'
            }}>
                {/* Başlık */}
                <div style={{
                fontWeight: 700,
                fontSize: '16px',
                color: '#22c55e',
                marginBottom: '10px',
                paddingBottom: '8px',
                borderBottom: '2px solid #f3f4f6',
                textAlign: 'center'
                }}>
                ✅ Completed Tasks
                </div>
                
                {/* Toplam */}
                <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '14px',
                marginBottom: '8px',
                paddingBottom: '8px',
                borderBottom: '1px solid #f3f4f6'
                }}>
                <span style={{ color: '#6b7280', fontWeight: 600 }}>Total</span>
                <span style={{ fontWeight: 700, color: '#111827', fontSize: '18px' }}>{total}</span>
                </div>
                
                {/* Detaylar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {/* Erken Tamamlanan */}
                {early > 0 && (
                    <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '13px'
                    }}>
                    <span style={{ color: '#6b7280' }}>
                        <span style={{ color: '#22c55e' }}>●</span> Early
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 600, color: '#22c55e' }}>{early}</span>
                        <span style={{ 
                        fontSize: '11px', 
                        color: '#9ca3af',
                        backgroundColor: '#f3f4f6',
                        padding: '1px 8px',
                        borderRadius: '999px'
                        }}>
                        {earlyPercent}%
                        </span>
                    </div>
                    </div>
                )}
                
                {/* Geç Tamamlanan */}
                {late > 0 && (
                    <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '13px'
                    }}>
                    <span style={{ color: '#6b7280' }}>
                        <span style={{ color: '#ef4444' }}>●</span> Late
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 600, color: '#ef4444' }}>{late}</span>
                        <span style={{ 
                        fontSize: '11px', 
                        color: '#9ca3af',
                        backgroundColor: '#f3f4f6',
                        padding: '1px 8px',
                        borderRadius: '999px'
                        }}>
                        {latePercent}%
                        </span>
                    </div>
                    </div>
                )}
                
                {/* Tam Zamanında */}
                {onTime > 0 && (
                    <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '13px'
                    }}>
                    <span style={{ color: '#6b7280' }}>
                        <span style={{ color: '#3b82f6' }}>●</span> On Time
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 600, color: '#3b82f6' }}>{onTime}</span>
                        <span style={{ 
                        fontSize: '11px', 
                        color: '#9ca3af',
                        backgroundColor: '#f3f4f6',
                        padding: '1px 8px',
                        borderRadius: '999px'
                        }}>
                        {onTimePercent}%
                        </span>
                    </div>
                    </div>
                )}
                </div>
                
                {/* Progress Bar - Genel tamamlama kalitesi */}
                <div style={{
                marginTop: '10px',
                paddingTop: '10px',
                borderTop: '1px solid #f3f4f6'
                }}>
                <div style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    marginBottom: '4px',
                    textAlign: 'center'
                }}>
                    {early > 0 && late === 0 && '🎯 All tasks completed early!'}
                    {late > 0 && early === 0 && '⚠️ All tasks completed late'}
                    {early > 0 && late > 0 && `📊 ${earlyPercent}% early, ${latePercent}% late`}
                    {early === 0 && late === 0 && onTime > 0 && '✅ Perfect timing!'}
                </div>
                </div>
            </div>
            );
        }
        
        // Diğer durumlar için basit tooltip
        return (
            <div style={{
            backgroundColor: '#ffffff',
            padding: '12px 16px',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            minWidth: '120px',
            textAlign: 'center'
            }}>
            <div style={{
                fontWeight: 600,
                fontSize: '14px',
                color: '#1f2937',
                marginBottom: '4px'
            }}>
                {data.name}
            </div>
            <div style={{
                fontSize: '20px',
                fontWeight: 700,
                color: '#111827'
            }}>
                {data.value}
            </div>
            <div style={{
                fontSize: '12px',
                color: '#6b7280',
                marginTop: '2px'
            }}>
                {data.name === 'In Progress' ? '🔄 Tasks being worked on' : 
                data.name === 'Not Started' ? '⏳ Tasks not yet started' : ''}
            </div>
            </div>
        );
        }
        return null;
    };

    // ============================================
    // ÖZEL TOOLTIP - Responsible/Assigned için
    // ============================================
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
        const data = payload[0].payload;
        const total = data.value || 0;
        const completed = data.completed || 0;
        const inProgress = data.inProgress || 0;
        const notStarted = data.notStarted || 0;
        const percentage = total > 0 ? ((completed / total) * 100).toFixed(1) : 0;
        
        return (
            <div style={{
            backgroundColor: '#ffffff',
            padding: '16px 20px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            minWidth: '200px',
            maxWidth: '280px'
            }}>
            <div style={{
                fontWeight: 700,
                fontSize: '16px',
                color: '#111827',
                marginBottom: '10px',
                paddingBottom: '8px',
                borderBottom: '2px solid #f3f4f6',
                textAlign: 'center'
            }}>
                {data.name}
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '14px'
                }}>
                <span style={{ color: '#6b7280' }}>📊 Total Tasks</span>
                <span style={{ fontWeight: 600, color: '#111827' }}>{total}</span>
                </div>
                
                <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '14px'
                }}>
                <span style={{ color: '#6b7280' }}>✅ Completed</span>
                <span style={{ fontWeight: 600, color: '#22c55e' }}>{completed}</span>
                </div>
                
                <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '14px'
                }}>
                <span style={{ color: '#6b7280' }}>🔄 In Progress</span>
                <span style={{ fontWeight: 600, color: '#f59e0b' }}>{inProgress}</span>
                </div>
                
                <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '14px'
                }}>
                <span style={{ color: '#6b7280' }}>⏳ Not Started</span>
                <span style={{ fontWeight: 600, color: '#94a3b8' }}>{notStarted}</span>
                </div>
            </div>
            
            <div style={{
                marginTop: '12px',
                paddingTop: '10px',
                borderTop: '1px solid #f3f4f6'
            }}>
                <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '13px',
                marginBottom: '4px'
                }}>
                <span style={{ color: '#6b7280' }}>Completion Rate</span>
                <span style={{ 
                    fontWeight: 700, 
                    color: percentage >= 70 ? '#22c55e' : percentage >= 40 ? '#f59e0b' : '#ef4444'
                }}>
                    {percentage}%
                </span>
                </div>
                <div style={{
                width: '100%',
                height: '6px',
                backgroundColor: '#f3f4f6',
                borderRadius: '999px',
                overflow: 'hidden'
                }}>
                <div style={{
                    width: `${percentage}%`,
                    height: '100%',
                    backgroundColor: percentage >= 70 ? '#22c55e' : percentage >= 40 ? '#f59e0b' : '#ef4444',
                    borderRadius: '999px',
                    transition: 'width 0.3s ease'
                }} />
                </div>
            </div>
            </div>
        );
        }
        return null;
    };

    // ============================================
    // CHART WRAPPER
    // ============================================
    const ChartWrapper = ({ title, data, colors, children, isStatusChart = false }) => {
        if (!data || data.length === 0) {
        return (
            <div style={{
            background: '#bfdbf4',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid #e5e7eb',
            marginBottom: '20px',
            textAlign: 'center'
            }}>
            <h3 style={{
                margin: '0 0 16px 0',
                fontSize: '16px',
                fontWeight: 700,
                color: '#1f2937',
            }}>
                {title}
            </h3>
            <p style={{ color: '#9ca3af', fontSize: '14px' }}>
                No data available
            </p>
            </div>
        );
        }

        return (
        <div style={{
            background: '#aecbef',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid #e5e7eb',
            marginBottom: '20px'
        }}>
            <h3 style={{
            margin: '0 0 16px 0',
            fontSize: '16px',
            fontWeight: 700,
            color: '#1f2937',
            textAlign: 'center'
            }}>
            {title}
            </h3>
            
            <ResponsiveContainer width="100%" height={200}>
            <PieChart>
                <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                >
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors ? colors[index % colors.length] : colorPalette[index % colorPalette.length]} />
                ))}
                </Pie>
                {isStatusChart ? (
                <Tooltip content={<StatusTooltip />} />
                ) : (
                <Tooltip content={<CustomTooltip />} />
                )}
                <Legend 
                verticalAlign="bottom" 
                height={36}
                wrapperStyle={{
                    fontSize: '12px',
                    paddingTop: '8px'
                }}
                />
            </PieChart>
            </ResponsiveContainer>
        </div>
        );
    };

    // Eğer hiç task yoksa
    if (safeTasks.length === 0) {
        return (
        <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#9ca3af'
        }}>
            <p style={{ fontSize: '16px' }}>No tasks to display charts</p>
            <p style={{ fontSize: '14px' }}>Add some tasks to see analytics</p>
        </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Chart 1: Priority Distribution */}
        {priorityData.length > 0 && (
            <ChartWrapper title="Tasks by Priority" data={priorityData} colors={priorityColors}>
            <Pie
                data={priorityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
            >
                {priorityData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={priorityColors[index % priorityColors.length]} />
                ))}
            </Pie>
            </ChartWrapper>
        )}

        {/* Chart 2: Status Distribution - Özel tooltip ile */}
        {statusData.length > 0 && (
            <ChartWrapper 
            title="Task Status" 
            data={statusData} 
            colors={statusColors}
            isStatusChart={true}
            >
            <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
            >
                {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={statusColors[index % statusColors.length]} />
                ))}
            </Pie>
            </ChartWrapper>
        )}

        {/* Chart 3: Tasks by Responsible Person */}
        {responsibleData.length > 0 && (
            <ChartWrapper title="Tasks by Responsible Person" data={responsibleData} colors={colorPalette}>
            <Pie
                data={responsibleData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
            >
                {responsibleData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colorPalette[index % colorPalette.length]} />
                ))}
            </Pie>
            </ChartWrapper>
        )}

        {/* Chart 4: Tasks by Assigned Person */}
        {assignedData.length > 0 && (
            <ChartWrapper title="Tasks by Assigned Person" data={assignedData} colors={colorPalette}>
            <Pie
                data={assignedData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
            >
                {assignedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colorPalette[index % colorPalette.length]} />
                ))}
            </Pie>
            </ChartWrapper>
        )}

        </div>
    );
    }