import bcrypt from 'bcryptjs';

const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

const users = [
  {
    username: 'JohnDoe',
    email: 'john@example.com',
    password: hashPassword('password123'),
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  },
  {
    username: 'JaneSmith',
    email: 'jane@example.com',
    password: hashPassword('password123'),
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
  },
  {
    username: 'TechGuru',
    email: 'tech@example.com',
    password: hashPassword('password123'),
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tech',
  },
];

export default users;
