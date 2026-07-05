// Accessible pill tabs: tabs = [{key, label}]
const Tabs = ({ tabs, active, onChange }) => (
  <div className="tabs" role="tablist">
    {tabs.map(tab => (
      <button
        key={tab.key}
        role="tab"
        aria-selected={active === tab.key}
        className={`tab ${active === tab.key ? "active" : ""}`}
        onClick={() => onChange(tab.key)}
      >
        {tab.label}
      </button>
    ))}
  </div>
);

export default Tabs;
