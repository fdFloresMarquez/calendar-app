import { useCalendarStore } from '../../hooks';

export const FabDelete = () => {

  const { startDeletingEvent, isEventActive } = useCalendarStore();

  const handleDelete = () => {
    startDeletingEvent();
  }

  return (
    <button
      aria-label="btn-delete"
      className="btn btn-danger fab-danger"
      onClick={handleDelete}
      style={{
        display: isEventActive ? '': 'none'
      }}
    >
      <i className="fas fa-trash-alt"></i>
    </button>
  )
}
