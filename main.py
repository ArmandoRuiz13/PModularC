import cloudinary
import cloudinary.uploader
from cloudinary.utils import cloudinary_url



# Optimize delivery by resizing and applying auto-format and auto-quality
optimize_url, _ = cloudinary_url("shoes", fetch_format="auto", quality="auto")
print(optimize_url)

