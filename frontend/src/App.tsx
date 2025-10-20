import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import AuthGuard from './features/auth/AuthGuard';
import TodoList from './features/todos/TodoList';
import TodoDetail from './features/todos/TodoDetail';
import CategoryList from './features/categories/CategoryList';
import TagList from './features/tags/TagList';
import Profile from './features/profile/Profile';

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root to todos */}
        <Route path="/" element={<Navigate to="/todos" replace />} />

        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route
          path="/todos"
          element={
            <AuthGuard>
              <TodoList />
            </AuthGuard>
          }
        />
        <Route
          path="/todos/:id"
          element={
            <AuthGuard>
              <TodoDetail />
            </AuthGuard>
          }
        />
        <Route
          path="/categories"
          element={
            <AuthGuard>
              <CategoryList />
            </AuthGuard>
          }
        />
        <Route
          path="/tags"
          element={
            <AuthGuard>
              <TagList />
            </AuthGuard>
          }
        />
        <Route
          path="/profile"
          element={
            <AuthGuard>
              <Profile />
            </AuthGuard>
          }
        />

        {/* 404 - Not found */}
        <Route path="*" element={<Navigate to="/todos" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
