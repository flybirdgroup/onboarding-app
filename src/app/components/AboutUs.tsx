import Image from 'next/image';

export default function AboutUs() {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">About Us: The Birth of Beer Accelerator</h2>
      <div className="mb-6">
        <Image
          src="/beer-accelerator-founders.jpg"
          alt="Beer Accelerator Founders"
          width={600}
          height={400}
          className="rounded-lg shadow-md"
        />
      </div>
      <p className="mb-4">
        On a sunny afternoon, three funny guys gathered around, chugging beers and complaining about how tedious the HSBC change request (CR) process was.
      </p>
      <p className="mb-4">
        "You know, applying for a CR feels like trying to get a visa—so many forms to fill out, and you're left waiting for weeks!" the first guy said, holding up his beer with a look of disdain.
      </p>
      <p className="mb-4">
        "Ha! You're right! The request I submitted this morning is probably being used as a lunch mat by a cat somewhere in HSBC!" the second guy laughed, his eyes a bit glazed.
      </p>
      <p className="mb-4">
        "Enough of this! We need to come up with a solution! Otherwise, we'll just keep drinking until we turn into beer kegs!" the third guy suddenly had a lightbulb moment and slapped the table.
      </p>
      <p className="mb-4">
        "Exactly! Let's build a one-click CI/CD platform so every team can onboard their use cases easily! From development to raising PRs, we'll automate the whole process!" the first guy exclaimed, getting excited.
      </p>
      <p className="mb-4">
        "Right! Based on their PR and deployment status, we can automatically generate CRs and schedule deployment jobs! It'll be like magic!" the second guy joined in, equally pumped.
      </p>
      <p className="mb-4">
        "We'll call this platform 'Beer Accelerator'! Because drinking beer helps us think faster!" the third guy shouted, as if he could already see the bright future ahead.
      </p>
      <p className="mb-4">
        And so, with beers in hand, these three funny guys embarked on their startup journey, determined to make work easier and more fun for everyone—while ensuring they could enjoy a few more pints along the way!
      </p>
    </div>
  );
}