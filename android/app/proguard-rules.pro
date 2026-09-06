# kotlinx.serialization keeps its generated serializers via companion objects.
-keepattributes *Annotation*, InnerClasses
-dontnote kotlinx.serialization.**
-keepclassmembers class np.loksewa.sathi.core.** {
    *** Companion;
}
-keepclasseswithmembers class np.loksewa.sathi.core.** {
    kotlinx.serialization.KSerializer serializer(...);
}
