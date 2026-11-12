const StatusBadge = ({ status }) => <span className={`status status-${status.replace(' ', '-')}`}>{status}</span>;

export default StatusBadge;
