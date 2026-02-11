// System Indicator Component (top-right)
function SystemIndicator({ isActive }) {
    return (
        <div className="system-indicator">
            <span className="indicator-label">System Admin</span>
            <div className="indicator-status">
                <span className={`status-text ${isActive ? 'active' : 'inactive'}`}>
                    {isActive ? 'ACTIVE' : 'INACTIVE'}
                </span>
                <div className={`status-circle ${isActive ? 'active' : 'inactive'}`}></div>
            </div>
        </div>
    );
}
