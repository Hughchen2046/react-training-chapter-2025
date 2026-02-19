import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

const OrderForm = ({ onOrderCreated, cartItems }) => {
  const MySwal = withReactContent(Swal);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      tel: '',
      address: '',
      message: '',
    },
    mode: 'onTouched',
  });
  //   console.log('cartItems', cartItems);

  const navigate = useNavigate();
  const onSubmit = async (formData) => {
    const payload = {
      data: {
        user: {
          name: formData.name,
          email: formData.email,
          tel: formData.tel,
          address: formData.address,
        },
        message: formData.message || '',
      },
    };

    try {
      await axios.post(`${API_BASE}/api/${API_PATH}/order`, payload);

      if (onOrderCreated) {
        await onOrderCreated();
      }

      await MySwal.fire({
        icon: 'success',
        title: '下單成功',
        text: `感謝您，${formData.name}。我們已收到您的訂單。`,
        confirmButtonText: '完成訂單',
      });

      reset();
      navigate('/product', { replace: true });
    } catch (error) {
      await MySwal.fire({
        icon: 'error',
        title: '送出失敗',
        text: error.response?.data?.message || '訂單送出失敗，請稍後再試。',
        confirmButtonText: '確認',
      });
    }
  };

  const onInvalid = async () => {
    await MySwal.fire({
      icon: 'error',
      title: '欄位未填完整',
      text: '請先確認姓名、Email、電話與地址欄位。',
      confirmButtonText: '確認',
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} noValidate>
      <div>
        <label className="pt-3" htmlFor="name">
          姓名
        </label>
        <input
          id="name"
          type="text"
          {...register('name', {
            required: '姓名為必填',
          })}
        />
        {errors.name && <span className="text-danger">{errors.name.message}</span>}
      </div>

      <div>
        <label className="pt-3" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          {...register('email', {
            required: 'Email 為必填',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Email 格式不正確',
            },
          })}
        />
        {errors.email && <span className="text-danger">{errors.email.message}</span>}
      </div>

      <div>
        <label className="pt-3" htmlFor="tel">
          電話
        </label>
        <input
          id="tel"
          type="tel"
          {...register('tel', {
            required: '電話為必填',
            validate: (value) => {
              const digits = value.replace(/\D/g, '');
              return digits.length > 8 || '電話需超過 8 碼';
            },
          })}
        />
        {errors.tel && <span className="text-danger">{errors.tel.message}</span>}
      </div>

      <div>
        <label className="pt-3" htmlFor="address">
          地址
        </label>
        <input
          id="address"
          type="text"
          {...register('address', {
            required: '地址為必填',
          })}
        />
        {errors.address && <span className="text-danger">{errors.address.message}</span>}
      </div>

      <div>
        <label className="pt-3" htmlFor="message">
          留言（非必填）
        </label>
        <textarea id="message" rows={4} {...register('message')} />
      </div>

      <button
        className="btn btn-aurora w-100 mt-3 py-1 fw-bold"
        type="submit"
        disabled={isSubmitting || cartItems.length === 0}
      >
        {isSubmitting ? '送出中...' : '送出訂單'}
      </button>
    </form>
  );
};

export default OrderForm;
