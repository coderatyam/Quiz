import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import java.time.Duration;

public class QuizAutomation {
    public static void main(String[] args) {
        // Initialize WebDriver
        WebDriver driver = new ChromeDriver();
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        try {
            // 1. Verify Landing Page [cite: 50]
            // Updated to your specific Live Server link
            String quizUrl = "http://127.0.0.1:5500/quiz.html";
            driver.get(quizUrl);

            // Print URL and Title as required
            System.out.println("Page URL: " + driver.getCurrentUrl());
            System.out.println("Page Title: " + driver.getTitle());

            // 2. Start Quiz [cite: 52]
            WebElement startButton = driver.findElement(By.id("start-btn")); // Ensure ID matches your HTML
            startButton.click();

            // Verify first question is displayed
            wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("question-container")));

            // 3. Question Navigation & Answer Selection [cite: 54, 57]
            // Loop through your questions (adjust '5' to your actual question count)
            for (int i = 1; i <= 5; i++) {
                // Verify question text is visible [cite: 55]
                WebElement questionText = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("question-text")));
                System.out.println("Answering Question " + i + ": " + questionText.getText());

                // Directly select answer option "3" as required [cite: 56]
                // Note: Ensure your radio button or option has value='3' or use appropriate locator
                WebElement option3 = driver.findElement(By.xpath("//input[@value='3']"));
                option3.click();
            }

            // 4. Submit Quiz [cite: 58]
            WebElement submitButton = driver.findElement(By.id("submit-btn"));
            submitButton.click();

            // 5. Score Calculation Verification [cite: 61, 62]
            wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("result-analysis")));
            System.out.println("Results analysis page verified successfully.");

        } catch (Exception e) {
            System.out.println("Automation Error: " + e.getMessage());
        } finally {
            // Clean up: Close the browser [cite: 66]
            driver.quit();
        }
    }
}