import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Typography,
	Container,
	CircularProgress,
	Alert,
	TextField,
	Pagination,
	Box,
	MenuItem,
	Select,
	FormControl,
	InputLabel,
	TableSortLabel
} from '@mui/material';

interface User {
	id: number;
	firstName: string;
	lastName: string;
	maidenName: string;
	age: number;
	email: string;
	phone: string;
	username: string;
	birthDate: string;
	address: {
		city: string;
		address: string;
	};
}

export default function Users() {
	const [users, setUsers] = useState<User[]>([]);
	const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [page, setPage] = useState(1);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [searchQuery, setSearchQuery] = useState('');
	const [sortBy, setSortBy] = useState<string>('id');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
	const navigate = useNavigate();

	// Загрузка всех пользователей
	useEffect(() => {
		setLoading(true);
		fetch('https://dummyjson.com/users')
			.then(res => {
				if (!res.ok) throw new Error('Ошибка загрузки данных');
				return res.json();
			})
			.then(data => {
				setUsers(data.users);
				setFilteredUsers(data.users);
				setLoading(false);
			})
			.catch(err => {
				setError(err.message);
				setLoading(false);
			});
	}, []);

	// Поиск пользователей
	useEffect(() => {
		if (searchQuery.trim() === '') {
			setFilteredUsers(users);
		} else {
			setLoading(true);
			fetch(`https://dummyjson.com/users/search?q=${searchQuery}`)
				.then(res => res.json())
				.then(data => {
					setFilteredUsers(data.users || []);
					setLoading(false);
					setPage(1);
				})
				.catch(() => {
					setError('Ошибка поиска');
					setLoading(false);
				});
		}
	}, [searchQuery, users]);

	// Сортировка
	useEffect(() => {
		if (searchQuery.trim() !== '') return;

		setLoading(true);
		fetch(`https://dummyjson.com/users?sortBy=${sortBy}&order=${sortOrder}`)
			.then(res => res.json())
			.then(data => {
				setFilteredUsers(data.users || []);
				setLoading(false);
				setPage(1);
			})
			.catch(() => {
				setError('Ошибка сортировки');
				setLoading(false);
			});
	}, [sortBy, sortOrder, searchQuery]);

	const handleSort = (field: string) => {
		if (sortBy === field) {
			setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
		} else {
			setSortBy(field);
			setSortOrder('asc');
		}
	};

	const handleRowClick = (id: number) => {
		navigate(`/user/${id}`);
	};

	const handleChangePage = (_: React.ChangeEvent<unknown>, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event: React.ChangeEvent<{ value: unknown }>) => {
		setRowsPerPage(Number(event.target.value));
		setPage(1);
	};

	const paginatedUsers = filteredUsers.slice(
		(page - 1) * rowsPerPage,
		page * rowsPerPage
	);

	if (loading && users.length === 0) {
		return (
			<Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
				<CircularProgress />
			</Container>
		);
	}

	if (error) {
		return (
			<Container sx={{ mt: 4 }}>
				<Alert severity="error">{error}</Alert>
			</Container>
		);
	}

	return (
		<Container maxWidth="xl" sx={{ py: 4 }}>
			<Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
				Список пользователей
			</Typography>

			{/* Поиск и пагинация */}
			<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, gap: 2, flexWrap: 'wrap' }}>
				<TextField
					label="Поиск пользователя"
					variant="outlined"
					size="small"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					sx={{ minWidth: 250 }}
					placeholder="Введите имя..."
				/>
				<FormControl size="small" sx={{ minWidth: 150 }}>
					<InputLabel>Записей на странице</InputLabel>
					<Select
						value={rowsPerPage}
						onChange={handleChangeRowsPerPage}
						label="Записей на странице"
					>
						<MenuItem value={5}>5</MenuItem>
						<MenuItem value={10}>10</MenuItem>
						<MenuItem value={15}>15</MenuItem>
						<MenuItem value={30}>30</MenuItem>
					</Select>
				</FormControl>
			</Box>

			{/* Таблица */}
			<TableContainer component={Paper}>
				<Table sx={{ minWidth: 650 }} aria-label="таблица пользователей">
					<TableHead>
						<TableRow sx={{ bgcolor: '#f5f5f5' }}>
							<TableCell>
								<TableSortLabel
									active={sortBy === 'id'}
									direction={sortBy === 'id' ? sortOrder : 'asc'}
									onClick={() => handleSort('id')}
								>
									<strong>ID</strong>
								</TableSortLabel>
							</TableCell>
							<TableCell>
								<TableSortLabel
									active={sortBy === 'firstName'}
									direction={sortBy === 'firstName' ? sortOrder : 'asc'}
									onClick={() => handleSort('firstName')}
								>
									<strong>Имя</strong>
								</TableSortLabel>
							</TableCell>
							<TableCell>
								<TableSortLabel
									active={sortBy === 'lastName'}
									direction={sortBy === 'lastName' ? sortOrder : 'asc'}
									onClick={() => handleSort('lastName')}
								>
									<strong>Фамилия</strong>
								</TableSortLabel>
							</TableCell>
							<TableCell><strong>Девичья фамилия</strong></TableCell>
							<TableCell>
								<TableSortLabel
									active={sortBy === 'age'}
									direction={sortBy === 'age' ? sortOrder : 'asc'}
									onClick={() => handleSort('age')}
								>
									<strong>Возраст</strong>
								</TableSortLabel>
							</TableCell>
							<TableCell>
								<TableSortLabel
									active={sortBy === 'email'}
									direction={sortBy === 'email' ? sortOrder : 'asc'}
									onClick={() => handleSort('email')}
								>
									<strong>Email</strong>
								</TableSortLabel>
							</TableCell>
							<TableCell><strong>Телефон</strong></TableCell>
							<TableCell>
								<TableSortLabel
									active={sortBy === 'username'}
									direction={sortBy === 'username' ? sortOrder : 'asc'}
									onClick={() => handleSort('username')}
								>
									<strong>Username</strong>
								</TableSortLabel>
							</TableCell>
							<TableCell><strong>Дата рождения</strong></TableCell>
							<TableCell>
								<TableSortLabel
									active={sortBy === 'address.city'}
									direction={sortBy === 'address.city' ? sortOrder : 'asc'}
									onClick={() => handleSort('address.city')}
								>
									<strong>Город</strong>
								</TableSortLabel>
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{paginatedUsers.map((user) => (
							<TableRow
								key={user.id}
								sx={{
									'&:hover': { bgcolor: '#fafafa', cursor: 'pointer' }
								}}
								onClick={() => handleRowClick(user.id)}
							>
								<TableCell>{user.id}</TableCell>
								<TableCell>{user.firstName}</TableCell>
								<TableCell>{user.lastName}</TableCell>
								<TableCell>{user.maidenName || '-'}</TableCell>
								<TableCell>{user.age}</TableCell>
								<TableCell>{user.email}</TableCell>
								<TableCell>{user.phone}</TableCell>
								<TableCell>{user.username}</TableCell>
								<TableCell>{new Date(user.birthDate).toLocaleDateString('ru-RU')}</TableCell>
								<TableCell>{user.address.city}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			{/* Пагинация */}
			<Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
				<Pagination
					count={Math.ceil(filteredUsers.length / rowsPerPage)}
					page={page}
					onChange={handleChangePage}
					color="primary"
					showFirstButton
					showLastButton
				/>
			</Box>
		</Container>
	);
}