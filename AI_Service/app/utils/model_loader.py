import torch
from torchvision import transforms, models

model = models.resnet18(pretrained=True)
model.fc = torch.nn.Linear(model.fc.in_features, 3)  # 3 classes: mild, moderate, severe
model.load_state_dict(torch.load("app/utils/wound_model.pth", map_location="cpu"))
model.eval()

label_map = {0: "mild", 1: "moderate", 2: "severe"}

transform = transforms.Compose([
    transforms.ToPILImage(),
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
])

def classify_wound(image_np):
    img_tensor = transform(image_np).unsqueeze(0)
    with torch.no_grad():
        outputs = model(img_tensor)
        _, predicted = torch.max(outputs, 1)
    return label_map[predicted.item()]