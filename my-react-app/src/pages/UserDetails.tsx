import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
	Container,
	Typography,
	Grid,
	Box,
	CircularProgress,
	Alert,
	Button,
	Card,
	CardContent,
	Divider,
	Chip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface UserDetails {
	id: number;
	firstName: string;
	lastName: string;
	maidenName: string;
	age: number;
	gender: string;
	email: string;
	phone: string;
	username: string;
	password: string;
	birthDate: string;
	image: string;
	bloodGroup: string;
	height: number;
	weight: number;
	eyeColor: string;
	hair: {
		color: string;
		type: string;
	};
	address: {
		address: string;
		city: string;
		state: string;
		stateCode: string;
		postalCode: string;
		country: string;
	};
	company: {
		department: string;
		name: string;
		title: string;
	};
	university: string;
	role: string;
}

export default function UserDetails() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [user, setUser] = useState<UserDetails | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetch(`https://dummyjson.com/users/${id}`)
			.then(res => {
				if (!res.ok) throw new Error('Пользователь не найден');
				return res.json();
			})
			.then(data => {
				setUser(data);
				setLoading(false);
			})
			.catch(err => {
				setError(err.message);
				setLoading(false);
			});
	}, [id]);

	if (loading) {
		return (
			<Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
				<CircularProgress />
			</Container>
		);
	}

	if (error || !user) {
		return (
			<Container sx={{ mt: 4 }}>
				<Alert severity="error">{error || 'Пользователь не найден'}</Alert>
				<Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')} sx={{ mt: 2 }}>
					Вернуться к списку
				</Button>
			</Container>
		);
	}

	return (
		<Container maxWidth="md" sx={{ py: 4 }}>
			<Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')} sx={{ mb: 2 }}>
				Назад к списку
			</Button>

			<Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
				Профиль пользователя
			</Typography>

			<Grid container spacing={3}>
				<Grid size={{ xs: 12, md: 6 }}>
					<Card>
						<CardContent>
							<Typography variant="h6" gutterBottom color="primary">
								Основная информация
							</Typography>
							<Divider sx={{ mb: 2 }} />
							<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
								<Box><strong>ID:</strong> {user.id}</Box>
								<Box><strong>Имя:</strong> {user.firstName} {user.lastName}</Box>
								<Box><strong>Девичья фамилия:</strong> {user.maidenName || '-'}</Box>
								<Box><strong>Возраст:</strong> {user.age} лет</Box>
								<Box><strong>Пол:</strong> {user.gender === 'male' ? 'Мужской' : 'Женский'}</Box>
								<Box><strong>Дата рождения:</strong> {new Date(user.birthDate).toLocaleDateString('ru-RU')}</Box>
								<Box><strong>Роль:</strong> <Chip label={user.role} color="primary" size="small" /></Box>
							</Box>
						</CardContent>
					</Card>
				</Grid>

				<Grid size={{ xs: 12, md: 6 }}>
					<Card>
						<CardContent>
							<Typography variant="h6" gutterBottom color="primary">
								Контактная информация
							</Typography>
							<Divider sx={{ mb: 2 }} />
							<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
								<Box><strong>Email:</strong> {user.email}</Box>
								<Box><strong>Телефон:</strong> {user.phone}</Box>
								<Box><strong>Username:</strong> {user.username}</Box>
								<Box><strong>Пароль:</strong> {user.password}</Box>
							</Box>
						</CardContent>
					</Card>
				</Grid>

				<Grid size={{ xs: 12, md: 6 }}>
					<Card>
						<CardContent>
							<Typography variant="h6" gutterBottom color="primary">
								Адрес
							</Typography>
							<Divider sx={{ mb: 2 }} />
							<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
								<Box><strong>Адрес:</strong> {user.address.address}</Box>
								<Box><strong>Город:</strong> {user.address.city}</Box>
								<Box><strong>Штат:</strong> {user.address.state} ({user.address.stateCode})</Box>
								<Box><strong>Почтовый индекс:</strong> {user.address.postalCode}</Box>
								<Box><strong>Страна:</strong> {user.address.country}</Box>
							</Box>
						</CardContent>
					</Card>
				</Grid>

				<Grid size={{ xs: 12, md: 6 }}>
					<Card>
						<CardContent>
							<Typography variant="h6" gutterBottom color="primary">
								Физические характеристики
							</Typography>
							<Divider sx={{ mb: 2 }} />
							<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
								<Box><strong>Рост:</strong> {user.height} см</Box>
								<Box><strong>Вес:</strong> {user.weight} кг</Box>
								<Box><strong>Группа крови:</strong> {user.bloodGroup}</Box>
								<Box><strong>Цвет глаз:</strong> {user.eyeColor}</Box>
								<Box><strong>Волосы:</strong> {user.hair.color} ({user.hair.type})</Box>
							</Box>
						</CardContent>
					</Card>
				</Grid>

				<Grid size={{ xs: 12, md: 6 }}>
					<Card>
						<CardContent>
							<Typography variant="h6" gutterBottom color="primary">
								Работа
							</Typography>
							<Divider sx={{ mb: 2 }} />
							<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
								<Box><strong>Компания:</strong> {user.company.name}</Box>
								<Box><strong>Отдел:</strong> {user.company.department}</Box>
								<Box><strong>Должность:</strong> {user.company.title}</Box>
							</Box>
						</CardContent>
					</Card>
				</Grid>

				<Grid size={{ xs: 12, md: 6 }}>
					<Card>
						<CardContent>
							<Typography variant="h6" gutterBottom color="primary">
								Образование
							</Typography>
							<Divider sx={{ mb: 2 }} />
							<Box><strong>Университет:</strong> {user.university}</Box>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</Container>
	);
}