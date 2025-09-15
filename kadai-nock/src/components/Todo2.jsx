import React, { useState } from 'react';

const Todo2 = () => {
  // タスクのリストを管理するstate
  const [todos, setTodos] = useState([]);
  // 入力欄のテキストを管理するstate
  const [inputText, setInputText] = useState('');

  // タスクを追加する関数
  const addTodo = () => {
    // 空文字チェック
    if (inputText.trim() === '') {
      return;
    }
    
    // 新しいタスクを追加
    const newTodo = {
      id: Date.now(), // 簡単なID生成
      text: inputText.trim(),
    };
    
    setTodos([...todos, newTodo]);
    setInputText(''); // 入力欄をクリア
  };

  // タスクを削除する関数
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Enterキーでタスクを追加
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h2>ToDo リスト</h2>
      
      {/* 入力欄と追加ボタン */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="タスクを入力してください"
          style={{
            padding: '8px',
            marginRight: '10px',
            width: '300px',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />
        <button
          onClick={addTodo}
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          追加
        </button>
      </div>

      {/* タスクリスト */}
      <div>
        {todos.length === 0 ? (
          <p style={{ color: '#666', fontStyle: 'italic' }}>タスクがありません</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {todos.map(todo => (
              <li
                key={todo.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px',
                  marginBottom: '8px',
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #dee2e6',
                  borderRadius: '4px'
                }}
              >
                <span>{todo.text}</span>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  style={{
                    padding: '4px 8px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  削除
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Todo2;
