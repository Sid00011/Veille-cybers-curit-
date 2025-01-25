from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.contrib.auth.models import User
from .serializers import UserSerializer  
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Vulnerability
from .serializers import VulnerabilitySerializer
from rest_framework.views import APIView
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

@csrf_exempt
def send_email(request):
    if request.method == 'POST':
        try:
            # Parse the request body
            data = json.loads(request.body)
            sender_email = data.get('from')
            sender_password = data.get('password')
            recipient_email = data.get('to')
            
            subject = data.get('subject')
            body = data.get('description')

            # Validate input fields
            if not all([sender_email, sender_password, recipient_email, subject, body]):
                return JsonResponse({'error': 'All fields are required.'}, status=400)

            # Create the email content
            msg = MIMEMultipart()
            msg['From'] = sender_email
            msg['To'] = recipient_email
            msg['Subject'] = subject
            msg.attach(MIMEText(body, 'plain'))

            # Connect to the SMTP server and send the email
            server = smtplib.SMTP('smtp.gmail.com', 587)
            server.starttls()
            server.login(sender_email, sender_password)
            server.send_message(msg)
            server.quit()

            return JsonResponse({'message': 'Email sent successfully!'}, status=200)

        except smtplib.SMTPAuthenticationError:
            return JsonResponse({'error': 'Invalid email or password.'}, status=401)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method.'}, status=405)




class VulnerabilityList(APIView):
    def get(self, request):
        vulnerabilities = Vulnerability.objects.all()
        serializer = VulnerabilitySerializer(vulnerabilities, many=True)
        return Response(serializer.data)

@api_view(['POST'])
def signup(request):
    
    if request.method == 'POST':
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        print(username , email , password)
       
        if not username or not email or not password:
            return Response({'error': 'All fields are required'}, status=status.HTTP_400_BAD_REQUEST)

      
        user = User.objects.create_user(username=username, email=email, password=password)

        
        user_data = UserSerializer(user).data
        return Response({'message': 'User created successfully', 'user': user_data}, status=status.HTTP_201_CREATED)



@api_view(['POST'])
def signin(request):
    if request.method == 'POST':
        email = request.data.get('email')
        password = request.data.get('password')

        
        if not email or not password:
            return Response({'error': 'les deux email et password sont obligatoire'}, status=status.HTTP_400_BAD_REQUEST)

        
        user = User.objects.filter(email=email).first()

      
        if user and user.check_password(password):
            
            refresh = RefreshToken.for_user(user)

            
            access_token = str(refresh.access_token)

            
            return Response({'message': 'Login successful', 'access_token': access_token, 'refresh_token': str(refresh)}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        


@api_view(['GET'])
def get_vulnerability_by_cve(request, code_cve):
    try:
        # Fetch the vulnerability by `code_cve`
        vulnerability = Vulnerability.objects.get(code_cve=code_cve)
        serializer = VulnerabilitySerializer(vulnerability)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Vulnerability.DoesNotExist:
        return Response({'error': 'Vulnerability not found'}, status=status.HTTP_404_NOT_FOUND)
