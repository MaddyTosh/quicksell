import React, { useState, useEffect } from "react";
import {
  MoreHorizontal,
  ChevronDown,
  Circle,
  CheckCircle2,
  Clock,
  AlertCircle,
  Signal,
  User,
  Plus,
} from "lucide-react";

const styles = `
  /* ... all previous CSS styles remain exactly the same ... */
  .kanban-container {
    min-height: 100vh;
    background-color: #f3f4f6;
  }

  .board-container {
    padding: 1rem;
  }

  .display-button-container {
    position: relative;
    margin-bottom: 1.5rem;
  }

  .display-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background-color: white;
    border-radius: 0.375rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border: none;
    cursor: pointer;
  }

  .display-menu {
    position: absolute;
    top: 100%;
    margin-top: 0.5rem;
    background-color: white;
    border-radius: 0.375rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 1rem;
    z-index: 10;
  }

  .menu-group {
    margin-bottom: 1rem;
  }

  .menu-label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
  }

  .menu-select {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.25rem;
  }

  .columns-container {
    display: flex;
    gap: 1rem;
    overflow-x: auto;
    padding-bottom: 1rem;
  }

  .column {
    width: 18rem;
    flex-shrink: 0;
  }

  .column-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
  }

  .column-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .column-title h2 {
    font-weight: 500;
    margin: 0;
  }

  .column-count {
    color: #6b7280;
  }

  .column-actions {
    display: flex;
    gap: 0.5rem;
  }

  .action-button {
    padding: 0.25rem;
    border: none;
    background: transparent;
    border-radius: 0.25rem;
    cursor: pointer;
  }

  .action-button:hover {
    background-color: #f3f4f6;
  }

  .ticket-card {
    padding: 1rem;
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    margin-bottom: 0.75rem;
  }

  .ticket-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.5rem;
  }

  .ticket-id {
    color: #6b7280;
  }

  .user-avatar {
    position: relative;
    width: 1.5rem;
    height: 1.5rem;
    background-color: #e5e7eb;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .user-initial {
    font-size: 0.75rem;
  }

  .user-status {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background-color: #10b981;
  }

  .ticket-title {
    display: flex;
    align-items: flex-start;
    margin-bottom: 0.5rem;
  }

  .ticket-title h3 {
    margin: 0 0 0 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
  }

  .ticket-footer {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .ticket-tag {
    padding: 0.25rem 0.5rem;
    background-color: #f3f4f6;
    border-radius: 0.375rem;
    font-size: 0.75rem;
  }

  .icon-urgent { color: #dc2626; }
  .icon-high { color: #d97706; }
  .icon-medium { color: #2563eb; }
  .icon-low { color: #6b7280; }
  .icon-none { color: #9ca3af; }
  .icon-done { color: #059669; }
  .icon-progress { color: #d97706; }
  .icon-todo { color: #9ca3af; }
`;

// Components remain the same
const PriorityIcon = ({ priority }) => {
  switch (priority) {
    case 4:
      return (
        <AlertCircle
          className="icon-urgent"
          style={{ width: "1rem", height: "1rem" }}
        />
      );
    case 3:
      return (
        <Signal
          className="icon-high"
          style={{ width: "1rem", height: "1rem" }}
        />
      );
    case 2:
      return (
        <Clock
          className="icon-medium"
          style={{ width: "1rem", height: "1rem" }}
        />
      );
    case 1:
      return (
        <Signal
          className="icon-low"
          style={{ width: "1rem", height: "1rem" }}
        />
      );
    default:
      return (
        <MoreHorizontal
          className="icon-none"
          style={{ width: "1rem", height: "1rem" }}
        />
      );
  }
};

const StatusIcon = ({ status }) => {
  switch (status.toLowerCase()) {
    case "done":
      return (
        <CheckCircle2
          className="icon-done"
          style={{ width: "1rem", height: "1rem" }}
        />
      );
    case "in progress":
      return (
        <Clock
          className="icon-progress"
          style={{ width: "1rem", height: "1rem" }}
        />
      );
    case "todo":
      return (
        <Circle
          className="icon-todo"
          style={{ width: "1rem", height: "1rem" }}
        />
      );
    default:
      return (
        <Circle
          className="icon-todo"
          style={{ width: "1rem", height: "1rem" }}
        />
      );
  }
};

const TicketCard = ({ ticket, user }) => {
  return (
    <div className="ticket-card">
      <div className="ticket-header">
        <span className="ticket-id">{ticket.id}</span>
        {user && (
          <div className="user-avatar">
            <span className="user-initial">{user.name.charAt(0)}</span>
            {user.available && <div className="user-status" />}
          </div>
        )}
      </div>
      <div className="ticket-title">
        <StatusIcon status={ticket.status} />
        <h3>{ticket.title}</h3>
      </div>
      <div className="ticket-footer">
        <PriorityIcon priority={ticket.priority} />
        <div className="ticket-tag">{ticket.tag[0]}</div>
      </div>
    </div>
  );
};

const Column = ({ title, tickets, users }) => {
  return (
    <div className="column">
      <div className="column-header">
        <div className="column-title">
          <StatusIcon status={title} />
          <h2>{title}</h2>
          <span className="column-count">{tickets.length}</span>
        </div>
        <div className="column-actions">
          <button className="action-button">
            <Plus style={{ width: "1rem", height: "1rem" }} />
          </button>
          <button className="action-button">
            <MoreHorizontal style={{ width: "1rem", height: "1rem" }} />
          </button>
        </div>
      </div>
      {tickets.map((ticket) => (
        <TicketCard
          key={ticket.id}
          ticket={ticket}
          user={users.find((u) => u.id === ticket.userId)}
        />
      ))}
    </div>
  );
};

const KanbanBoard = () => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [grouping, setGrouping] = useState(
    localStorage.getItem("grouping") || "status"
  );
  const [sorting, setSorting] = useState(
    localStorage.getItem("sorting") || "priority"
  );
  const [showDisplayMenu, setShowDisplayMenu] = useState(false);

  useEffect(() => {
    fetch("https://api.quicksell.co/v1/internal/frontend-assignment")
      .then((response) => response.json())
      .then((data) => {
        setTickets(data.tickets);
        setUsers(data.users);
      });
  }, []);

  useEffect(() => {
    localStorage.setItem("grouping", grouping);
    localStorage.setItem("sorting", sorting);
  }, [grouping, sorting]);

  const sortTickets = (ticketsToSort) => {
    return [...ticketsToSort].sort((a, b) => {
      if (sorting === "priority") {
        return b.priority - a.priority;
      }
      return a.title.localeCompare(b.title);
    });
  };

  const groupTickets = () => {
    if (grouping === "status") {
      const groups = {
        Todo: [],
        "In Progress": [],
        Done: [],
        Backlog: [],
      };
      sortTickets(tickets).forEach((ticket) => {
        const status = ticket.status;
        if (!groups[status]) groups[status] = [];
        groups[status].push(ticket);
      });
      return groups;
    }

    if (grouping === "user") {
      const groups = {};
      users.forEach((user) => {
        groups[user.name] = [];
      });
      sortTickets(tickets).forEach((ticket) => {
        const user = users.find((u) => u.id === ticket.userId);
        if (user) groups[user.name].push(ticket);
      });
      return groups;
    }

    if (grouping === "priority") {
      const groups = {
        Urgent: [],
        High: [],
        Medium: [],
        Low: [],
        "No Priority": [],
      };
      sortTickets(tickets).forEach((ticket) => {
        switch (ticket.priority) {
          case 4:
            groups["Urgent"].push(ticket);
            break;
          case 3:
            groups["High"].push(ticket);
            break;
          case 2:
            groups["Medium"].push(ticket);
            break;
          case 1:
            groups["Low"].push(ticket);
            break;
          default:
            groups["No Priority"].push(ticket);
        }
      });
      return groups;
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="kanban-container">
        <div className="board-container">
          <div className="display-button-container">
            <button
              className="display-button"
              onClick={() => setShowDisplayMenu(!showDisplayMenu)}
            >
              <MoreHorizontal style={{ width: "1rem", height: "1rem" }} />
              <span>Display</span>
              <ChevronDown style={{ width: "1rem", height: "1rem" }} />
            </button>

            {showDisplayMenu && (
              <div className="display-menu">
                <div className="menu-group">
                  <label className="menu-label">Grouping</label>
                  <select
                    value={grouping}
                    onChange={(e) => setGrouping(e.target.value)}
                    className="menu-select"
                  >
                    <option value="status">Status</option>
                    <option value="user">User</option>
                    <option value="priority">Priority</option>
                  </select>
                </div>
                <div className="menu-group">
                  <label className="menu-label">Ordering</label>
                  <select
                    value={sorting}
                    onChange={(e) => setSorting(e.target.value)}
                    className="menu-select"
                  >
                    <option value="priority">Priority</option>
                    <option value="title">Title</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <div className="columns-container">
            {Object.entries(groupTickets() || {}).map(
              ([title, groupTickets]) => (
                <Column
                  key={title}
                  title={title}
                  tickets={groupTickets}
                  users={users}
                />
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default KanbanBoard;
