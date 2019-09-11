import uniqueId from 'lodash/uniqueId';
import React from 'react';
import Sortable from 'react-sortablejs';

// File here for reference...
export default function SortableGrid({ items, onChange }) {
  return (
    <Sortable
      // Sortable options (https://github.com/RubaXa/Sortable#options)
      className='grid-container'
      options={{
        animation: 150,
        ghostClass: 'bar-class',
        dragClass: 'foo-class',

        // Necessary to allow opacity: 1. HTML5 DnD provides no mechanism for this.
        forceFallback: true,
      }}
      onChange={(order, sortable, evt) => onChange(order)}
    >
      {items.map(val =>
        <div className='grid-item' key={uniqueId()} data-id={val}>List Item: {val}</div>
      )}
    </Sortable>
  )
}